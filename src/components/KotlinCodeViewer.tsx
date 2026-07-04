import React, { useState } from "react";
import { Copy, Check, FileCode, Code, Smartphone } from "lucide-react";

interface CodeFile {
  name: string;
  path: string;
  code: string;
}

const KOTLIN_FILES: CodeFile[] = [
  {
    name: "MainActivity.kt",
    path: "app/src/main/java/com/mordor/tracker/MainActivity.kt",
    code: `package com.mordor.tracker

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.mordor.tracker.ui.theme.WalkToMordorTheme
import com.mordor.tracker.ui.WalkToMordorApp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            WalkToMordorTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    WalkToMordorApp()
                }
            }
        }
    }
}`
  },
  {
    name: "WalkToMordorApp.kt",
    path: "app/src/main/java/com/mordor/tracker/ui/WalkToMordorApp.kt",
    code: `package com.mordor.tracker.ui

import android.speech.tts.TextToSpeech
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mordor.tracker.data.MILESTONES
import com.mordor.tracker.data.Milestone
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WalkToMordorApp() {
    val context = LocalContext.current
    var totalKms by remember { mutableStateOf(0.0) }
    var inputKms by remember { mutableStateOf("") }
    
    // Track unlocked milestones
    var activeMilestone by remember { mutableStateOf<Milestone?>(null) }
    var lastTriggeredMilestoneId by remember { mutableStateOf("") }

    // TTS Setup
    var tts: TextToSpeech? by remember { mutableStateOf(null) }
    var isTtsInitialized by remember { mutableStateOf(false) }

    DisposableEffect(Unit) {
        val speech = TextToSpeech(context) { status ->
            if (status == TextToSpeech.SUCCESS) {
                isTtsInitialized = true
            }
        }
        speech.language = Locale.getDefault()
        tts = speech
        onDispose {
            speech.stop()
            speech.shutdown()
        }
    }

    // Check for milestones whenever totalKms changes
    LaunchedEffect(totalKms) {
        val currentMilestone = MILESTONES.lastOrNull { totalKms >= it.distance }
        if (currentMilestone != null && currentMilestone.id != lastTriggeredMilestoneId) {
            activeMilestone = currentMilestone
            lastTriggeredMilestoneId = currentMilestone.id
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Walk to Mordor", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF2C1B18),
                    titleContentColor = Color(0xFFE6C280)
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(Color(0xFF1E1513))
        ) {
            // Interactive Middle-Earth Map View
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) {
                MiddleEarthMap(
                    totalKms = totalKms,
                    milestones = MILESTONES
                )
            }

            // Bottom Input & Stats Panel
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF2D221E))
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Total Distance Walked",
                        color = Color(0xFFB09893),
                        fontSize = 14.sp
                    )
                    Text(
                        text = "\${String.format(\"%.1f\", totalKms)} km / 2932.0 km",
                        color = Color(0xFFE6C280),
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(vertical = 4.dp)
                    )

                    // Linear Progress Bar
                    LinearProgressIndicator(
                        progress = { (totalKms / 2932.0).toFloat().coerceIn(0f, 1f) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                            .padding(vertical = 8.dp),
                        color = Color(0xFFDF5A3E),
                        trackColor = Color(0xFF4A3B37)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = inputKms,
                            onValueChange = { inputKms = it },
                            label = { Text("Add Kilometers", color = Color(0xFFB09893)) },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.LightGray,
                                focusedBorderColor = Color(0xFFE6C280),
                                unfocusedBorderColor = Color(0xFF4A3B37)
                            )
                        )

                        Spacer(modifier = Modifier.width(8.dp))

                        Button(
                            onClick = {
                                val kms = inputKms.toDoubleOrNull() ?: 0.0
                                if (kms > 0.0) {
                                    totalKms += kms
                                    inputKms = ""
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDF5A3E)),
                            modifier = Modifier.height(56.dp)
                        ) {
                            Text("Log Walk")
                        }
                    }
                }
            }
        }

        // Beautiful milestone popup
        activeMilestone?.let { milestone ->
            MilestoneDialog(
                milestone = milestone,
                onDismiss = { activeMilestone = null },
                onPlayAudio = {
                    if (isTtsInitialized) {
                        tts?.speak(
                            milestone.audioNarrative,
                            TextToSpeech.QUEUE_FLUSH,
                            null,
                            null
                        )
                    }
                }
            )
        }
    }
}`
  },
  {
    name: "MiddleEarthMap.kt",
    path: "app/src/main/java/com/mordor/tracker/ui/MiddleEarthMap.kt",
    code: `package com.mordor.tracker.ui

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mordor.tracker.R
import com.mordor.tracker.data.Milestone
import kotlin.math.roundToInt

@Composable
fun MiddleEarthMap(
    totalKms: Double,
    milestones: List<Milestone>
) {
    // Zoom and pan state
    var scale by remember { mutableStateOf(2.0f) }
    var offset by remember { mutableStateOf(Offset.Zero) }

    // Find current active milestone or interpolated position
    val currentPosition = rememberInterpolatedPosition(totalKms, milestones)

    // Smoothly animate the marker's coordinate position
    val animatedX by animateFloatAsState(
        targetValue = currentPosition.x,
        animationSpec = tween(durationMillis = 1500)
    )
    val animatedY by animateFloatAsState(
        targetValue = currentPosition.y,
        animationSpec = tween(durationMillis = 1500)
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                detectTransformGestures { _, pan, zoom, _ ->
                    scale = (scale * zoom).coerceIn(1.0f, 5.0f)
                    
                    // Bound the offset based on scale to keep map centered
                    val maxX = (size.width * (scale - 1)) / 2
                    val maxY = (size.height * (scale - 1)) / 2
                    
                    offset = Offset(
                        x = (offset.x + pan.x).coerceIn(-maxX, maxX),
                        y = (offset.y + pan.y).coerceIn(-maxY, maxY)
                    )
                }
            }
    ) {
        // Massive Middle-Earth Map Image
        Box(
            modifier = Modifier
                .fillMaxSize()
                .graphicsLayer(
                    scaleX = scale,
                    scaleY = scale,
                    translationX = offset.x,
                    translationY = offset.y
                )
        ) {
            // Simulated placeholder map image (in a real app, from drawables R.drawable.middle_earth)
            Image(
                painter = painterResource(id = R.drawable.middle_earth_map),
                contentDescription = "Middle-Earth Map",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )

            // Render all milestone markers
            milestones.forEach { milestone ->
                val isUnlocked = totalKms >= milestone.distance
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                ) {
                    Box(
                        modifier = Modifier
                            .offset {
                                IntOffset(
                                    x = ((milestone.coordinates.x / 100f) * size.width).roundToInt() - 12,
                                    y = ((milestone.coordinates.y / 100f) * size.height).roundToInt() - 12
                                )
                            }
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(if (isUnlocked) Color(0xFFDF5A3E) else Color(0xFF555555))
                    )
                }
            }

            // Animated Journey Avatar Token
            Box(
                modifier = Modifier
                    .offset {
                        IntOffset(
                            x = ((animatedX / 100f) * size.width).roundToInt() - 16,
                            y = ((animatedY / 100f) * size.height).roundToInt() - 16
                        )
                    }
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFE6C280))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(4.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF2C1B18)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "💍", 
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

// Helpers to find the current position along the path segment
@Composable
fun rememberInterpolatedPosition(totalKms: Double, milestones: List<Milestone>): Position {
    return remember(totalKms) {
        if (milestones.isEmpty()) return@remember Position(0f, 0f)
        
        // If past final milestone
        val last = milestones.last()
        if (totalKms >= last.distance) {
            return@remember Position(last.coordinates.x, last.coordinates.y)
        }

        // Find current segment
        var startNode = milestones.first()
        var endNode = milestones.last()
        
        for (i in 0 until milestones.size - 1) {
            if (totalKms >= milestones[i].distance && totalKms < milestones[i+1].distance) {
                startNode = milestones[i]
                endNode = milestones[i+1]
                break
            }
        }

        val segmentDistance = endNode.distance - startNode.distance
        if (segmentDistance <= 0.0) {
            Position(startNode.coordinates.x, startNode.coordinates.y)
        } else {
            val ratio = ((totalKms - startNode.distance) / segmentDistance).toFloat()
            val interpX = startNode.coordinates.x + (endNode.coordinates.x - startNode.coordinates.x) * ratio
            val interpY = startNode.coordinates.y + (endNode.coordinates.y - startNode.coordinates.y) * ratio
            Position(interpX, interpY)
        }
    }
}

data class Position(val x: Float, val y: Float)
`
  },
  {
    name: "MilestoneDialog.kt",
    path: "app/src/main/java/com/mordor/tracker/ui/MilestoneDialog.kt",
    code: `package com.mordor.tracker.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.mordor.tracker.data.Milestone

@Composable
fun MilestoneDialog(
    milestone: Milestone,
    onDismiss: () -> void,
    onPlayAudio: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .border(1.dp, Color(0xFFE6C280), RoundedCornerShape(16.dp)),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF231816))
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Ring Banner
                Text(
                    text = "✨ MILESTONE UNLOCKED ✨",
                    color = Color(0xFFE6C280),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.5.sp
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = milestone.name,
                    color = Color.White,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = "\${milestone.distance} km traveled",
                    color = Color(0xFFDF5A3E),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Specialized Book text card
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFF1B110F))
                        .padding(12.dp)
                ) {
                    Column {
                        Text(
                            text = "\\"\${milestone.bookText}\\"",
                            color = Color(0xFFD4C3C0),
                            fontSize = 14.sp,
                            fontStyle = FontStyle.Italic,
                            lineHeight = 20.sp,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "— J.R.R. Tolkien, The Lord of the Rings",
                            color = Color(0xFF8C736E),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.End,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = milestone.description,
                    color = Color.LightGray,
                    fontSize = 14.sp,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(24.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = Color(0xFFB09893)
                        )
                    ) {
                        Text("Close")
                    }

                    Button(
                        onClick = onPlayAudio,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDF5A3E))
                    ) {
                        Icon(
                            imageVector = Icons.Default.PlayArrow,
                            contentDescription = "Play Narration",
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Play Narration")
                    }
                }
            }
        }
    }
}
`
  },
  {
    name: "MilestonesData.kt",
    path: "app/src/main/java/com/mordor/tracker/data/MilestonesData.kt",
    code: `package com.mordor.tracker.data

data class Milestone(
    val id: String,
    val name: String,
    val distance: Int,
    val description: String,
    val bookText: String,
    val audioNarrative: String,
    val coordinates: Position
)

data class Position(val x: Float, val y: Float)

val MILESTONES = listOf(
    Milestone(
        id = "the_shire",
        name = "The Shire (Bag End)",
        distance = 0,
        description = "The peaceful green hills of Hobbiton, where your epic journey begins.",
        bookText = "The Shire was divided into four quarters, the Farthings... In this pleasant district, hobbits lived in their holes and were merry.",
        audioNarrative = "Your epic journey begins. Bag End is quiet, but adventure lies ahead. Take your first steps on the road.",
        coordinates = Position(16f, 24f)
    ),
    Milestone(
        id = "bree",
        name = "Bree (The Prancing Pony)",
        distance = 40,
        description = "An ancient settlement of Men and Hobbits, surrounded by shadows.",
        bookText = "They came to a large, black-painted house at the end of the road. Above the door was a sign: The Prancing Pony.",
        audioNarrative = "You have reached Bree! Dark cloaks watch the tavern doors, but a friendly Ranger named Strider is waiting to guide you into the wild.",
        coordinates = Position(25f, 28f)
    ),
    Milestone(
        id = "weathertop",
        name = "Weathertop (Amon Sûl)",
        distance = 120,
        description = "The ruins of an ancient watchtower on a windswept hill.",
        bookText = "There they stood, on the ancient crown of Amon Sûl, looking out over the brown lands... Then, out of the darkness, five tall shadows rose.",
        audioNarrative = "A chilling wind blows across Weathertop. The Nazgûl have tracked you. Draw your sword, but beware the blade of Morgul!",
        coordinates = Position(32f, 26f)
    ),
    Milestone(
        id = "rivendell",
        name = "Rivendell (Imladris)",
        distance = 390,
        description = "The Last Homely House East of the Sea, sanctuary of Lord Elrond.",
        bookText = "Frodo woke and found himself lying in a bed. 'Where am I, and what is the time?' he asked. 'In the House of Elrond, and it is ten o'clock in the morning,' said Gandalf.",
        audioNarrative = "Welcome to Rivendell, the Last Homely House East of the Sea. Rest your weary feet, for here, the Fellowship of the Ring is formed.",
        coordinates = Position(46f, 32f)
    ),
    Milestone(
        id = "moria",
        name = "Mines of Moria (Khazad-dûm)",
        distance = 750,
        description = "The dark, deep dwarven kingdom under the Misty Mountains.",
        bookText = "The Doom of Moria was near... A shadow and a threat had grown in the dark. 'Drums, drums in the deep. They are coming.'",
        audioNarrative = "You stand in the cold darkness of Khazad-dûm. Keep your steps silent, lest the drums of the deep awake the ancient Balrog.",
        coordinates = Position(44f, 49f)
    ),
    Milestone(
        id = "lothlorien",
        name = "Lothlórien (The Golden Wood)",
        distance = 950,
        description = "The magical forest realm of the Galadhrim elf lords.",
        bookText = "The golden wood was filled with light... 'Welcome, Elf-friend,' said the Lady Galadriel. 'Your quest stands upon the edge of a knife. Stray but a little and it will fail.'",
        audioNarrative = "The golden glades of Lothlórien offer peace and visions of the future. Lady Galadriel bestows gifts of light and hope upon your journey.",
        coordinates = Position(53f, 54f)
    ),
    Milestone(
        id = "amon_hen",
        name = "Amon Hen (The Seat of Seeing)",
        distance = 1400,
        description = "Where the Fellowship fractures on the banks of the River Anduin.",
        bookText = "He ran up the hill. 'Frodo!' he cried. 'The Ring has taken you!' But Frodo was gone, slipping away on the Anduin...",
        audioNarrative = "On the high seat of Amon Hen, the Fellowship is broken. Boromir has fallen. Samwise Gamgee refuses to leave your side as you cross the river alone.",
        coordinates = Position(58f, 68f)
    ),
    Milestone(
        id = "dead_marshes",
        name = "The Dead Marshes",
        distance = 1850,
        description = "A dismal swamp where the candles of corpses flicker in the dark.",
        bookText = "It was a dreary land. Mires and fens lay on either side... 'Don't look at the lights!' whispered Gollum. 'The dead faces, do not touch them!'",
        audioNarrative = "Trudging through the thick, toxic mists of the Dead Marshes. Gollum guides you, but beware the flickering candles of the dead in the water.",
        coordinates = Position(70f, 71f)
    ),
    Milestone(
        id = "black_gate",
        name = "The Black Gate (Morannon)",
        distance = 2100,
        description = "The massive iron entrance to the dark land of Mordor.",
        bookText = "Before them loomed the Towers of the Teeth, and between them lay the Great Gate of Morannon, bolted and locked.",
        audioNarrative = "The Black Gate of Mordor is closed and guarded by thousands of Orcs. You must trust Gollum's promise of a secret stair into the shadow land.",
        coordinates = Position(74f, 74f)
    ),
    Milestone(
        id = "mount_doom",
        name = "Mount Doom (Orodruin)",
        distance = 2932,
        description = "The fiery volcano at the heart of Mordor where the Ring was forged.",
        bookText = "Frodo reached the Cracks of Doom... 'I have come,' he said. 'But I do not choose now to do what I came to do. I will not do this deed. The Ring is mine!'",
        audioNarrative = "You have walked 2,932 kilometers! You stand at the Cracks of Doom. With a final struggle, the One Ring is cast into the fire! The shadow of Sauron is destroyed, and Middle-earth is saved!",
        coordinates = Position(86f, 82f)
    )
)
`
  }
];

export function KotlinCodeViewer() {
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = KOTLIN_FILES[activeFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full border border-orange-950/40 rounded-2xl bg-[#140e0c] text-[#d4c3c0] shadow-2xl overflow-hidden" id="kotlin-ide-frame">
      {/* IDE Tab Header */}
      <div className="flex items-center justify-between bg-[#1f1513] border-b border-orange-950/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-sm tracking-tight text-[#e6c280]">
            Codi Font Natiu d'Android Jetpack Compose
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs bg-amber-950/30 text-amber-500 border border-amber-900/30 px-2 py-0.5 rounded-full">
          <Smartphone className="w-3.5 h-3.5" />
          Kotlin 1.9.x
        </div>
      </div>

      {/* File Explorer Selector */}
      <div className="flex overflow-x-auto bg-[#1b110f] border-b border-orange-950/20 px-2 gap-1 scrollbar-thin">
        {KOTLIN_FILES.map((file, idx) => (
          <button
            key={file.name}
            id={`file-tab-${idx}`}
            onClick={() => setActiveFileIdx(idx)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-t-2 transition-all cursor-pointer ${
              activeFileIdx === idx
                ? "bg-[#140e0c] border-amber-500 text-[#e6c280] font-medium"
                : "border-transparent text-[#8c736e] hover:text-[#d4c3c0] hover:bg-[#1f1513]/40"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            {file.name}
          </button>
        ))}
      </div>

      {/* File Path Indicator */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#140e0c] border-b border-orange-950/10 text-[10px] font-mono text-[#8c736e]">
        <span>{activeFile.path}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-amber-600 hover:text-amber-400 font-mono transition-all px-2 py-0.5 rounded hover:bg-amber-950/20"
          title="Copiar contingut"
          id="copy-code-btn"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copiat!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copiar Codi
            </>
          )}
        </button>
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed select-text bg-[#140e0c] scrollbar-thin">
        <pre className="whitespace-pre overflow-x-auto text-left">
          <code>
            {activeFile.code.split("\n").map((line, idx) => (
              <div key={idx} className="table-row hover:bg-[#1e1513]/30">
                <span className="table-cell text-right pr-4 text-[#5c4945] select-none text-[10px] w-8">
                  {idx + 1}
                </span>
                <span className="table-cell text-left whitespace-pre">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
