import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Compass, 
  Volume2, 
  VolumeX, 
  Plus, 
  History, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  Info,
  ZoomIn,
  ZoomOut,
  Flame,
  Footprints,
  TrendingUp,
  RotateCcw,
  Camera,
  User,
  Upload,
  ChevronDown,
  Book
} from "lucide-react";
import { Milestone, ActivityLog, JourneyState } from "../types";
import { MILESTONES } from "../data/milestones";
import { 
  playPeacefulChime, 
  playDarkChime, 
  playVictoryChime, 
  playClickSound, 
  playStepSound,
  playCustomAudio
} from "../utils/audio";
const mapImg = "https://upload.wikimedia.org/wikipedia/commons/4/44/Map_of_Middle-Earth.svg";

// APP LOGO IMAGE SOURCE (YOU CAN REPLACE THIS URL WITH YOUR OWN LOGO ASSET IN THE FUTURE!)
const APP_LOGO_URL = "data:image/jpeg;base64,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";

// TOP APP BAR LOGO IMAGE SOURCE (YOU CAN REPLACE THIS URL WITH YOUR OWN LOGO ASSET IN THE FUTURE!)
const TOP_APP_BAR_LOGO_URL = "https://freesvg.org/img/browser-mockup-topbar.png"

// CONFIGURABLE DAILY KILOMETER LIMIT (CHANGE THIS TO SET A DIFFERENT LIMIT PER DAY!)
const DAILY_KM_LIMIT = 1000000;

// Preset Middle-earth avatars
export const AVATAR_OPTIONS = [
  { id: "frodo", label: "Frodo", emoji: "🧑‍🌾", description: "El portador de l'Anell fidel" },
  { id: "sam", label: "Sam", emoji: "👬", description: "L'amic protector que mai defalleix" },
  { id: "aragorn", label: "Àragorn", emoji: "👑", description: "L'hereu al tron de Góndor" },
  { id: "legolas", label: "Lègolas", emoji: "🏹", description: "L'arquer elf de visió infinita" },
  { id: "gimli", label: "Gimli", emoji: "🪓", description: "El rude i orgullós guerrer nan" },
  { id: "gandalf", label: "Gàndalf", emoji: "🧙", description: "El savi i poderós mag protector" }
];

// Enllaços de música de fons per a cada regió (pots modificar les cançons lliurement aquí!)
export const REGION_BG_MUSIC: Record<string, string> = {
  "La Comarca (Caminant cap a Bree)": "/audio/music/The Shire.mp3",
  "Terres de Bree (Camí de la Sota del Vent)": "public/audio/music/bree.mp3",
  "Turons de la Sota del Vent (Ruta a Rivendell)": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "Rivendell (Ruta cap a les Mines de Mòria)": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "Mines de Mòria (Sota les Muntanyes Boiroses)": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "Lothlórien (El Bosc Daurat de Galàdriel)": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  "Amon Hen (Creuant el riu Anduin)": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  "Els Marjals Morts (Seguint en Gòl·lum)": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  "La Porta Negra (Altiplà desolat de Gorgoroth, Mórdor)": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  "Esquerdes del Destí, Mórdor": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
};

// Map image loaded via ESM import
export function ComposeAppSimulator() {
  // Journey state loaded from localStorage or initialized
  const [state, setState] = useState<JourneyState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("walk_to_mordor_state");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      totalKms: 0,
      currentMilestoneId: "the_shire",
      unlockedMilestones: ["the_shire"],
      logs: []
    };
  });

  // Dropdown states for logged walks
  const [selectedKm, setSelectedKm] = useState<number>(5);
  const [selectedMeters, setSelectedMeters] = useState<number>(0);
  const [noteVal, setNoteVal] = useState("");

  // Temporary state for custom character creator screen
  const [tempName, setTempName] = useState(state.username || "");
  const [tempAvatarId, setTempAvatarId] = useState(state.avatarId || "frodo");
  const [tempCustomAvatarUrl, setTempCustomAvatarUrl] = useState(state.customAvatarUrl || "");
  
  // UI Tabs for logs drawer
  const [activeTab, setActiveTab] = useState<"logs" | "stats">("logs");
  const [activePopup, setActivePopup] = useState<Milestone | null>(null);
  const [mapScale, setMapScale] = useState(5.5); // Default focused auto-zoom (crisp detail and epic size)
  const [mapOffset, setMapOffset] = useState({ x: -220, y: -110 });
  const [viewportSize, setViewportSize] = useState({ width: 800, height: 600 });
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [bgMusic, setBgMusic] = useState<HTMLAudioElement | null>(null);
  const [isBgMuted, setIsBgMuted] = useState(true);
  const [showLogs, setShowLogs] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAddWalkModal, setShowAddWalkModal] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);
  const [showHud, setShowHud] = useState(false); // Hidden by default as requested
  const [dismissedSplash, setDismissedSplash] = useState(false); // Enable dismissing the final volcanic splash screen
  const [dailyLimitError, setDailyLimitError] = useState<string | null>(null);

  // Drag-to-pan references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });

  // Pinch-to-zoom mobile gesture references
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartScaleRef = useRef<number>(5.5);
  const touchStartMidRef = useRef({ x: 0, y: 0 });
  const touchStartOffsetRef = useRef({ x: 0, y: 0 });

  // Monitor viewport resize to update baseScale and boundaries dynamically
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setViewportSize({
          width: entry.contentRect.width || 800,
          height: entry.contentRect.height || 600,
        });
      }
    });
    observer.observe(mapContainerRef.current);
    // Initial size check
    setViewportSize({
      width: mapContainerRef.current.clientWidth || 800,
      height: mapContainerRef.current.clientHeight || 600,
    });
    return () => observer.disconnect();
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem("walk_to_mordor_state", JSON.stringify(state));
  }, [state]);


  // Compute interpolated position for avatar along path
  const getAvatarPosition = (currentDist: number): { x: number; y: number } => {
    // Past last milestone
    const lastMilestone = MILESTONES[MILESTONES.length - 1];
    if (currentDist >= lastMilestone.distance) {
      return lastMilestone.coordinates;
    }

    // Find current active segment
    let startNode = MILESTONES[0];
    let endNode = MILESTONES[MILESTONES.length - 1];

    for (let i = 0; i < MILESTONES.length - 1; i++) {
      if (currentDist >= MILESTONES[i].distance && currentDist < MILESTONES[i+1].distance) {
        startNode = MILESTONES[i];
        endNode = MILESTONES[i+1];
        break;
      }
    }

    const segmentDist = endNode.distance - startNode.distance;
    if (segmentDist <= 0) {
      return startNode.coordinates;
    }

    const ratio = (currentDist - startNode.distance) / segmentDist;
    return {
      x: startNode.coordinates.x + (endNode.coordinates.x - startNode.coordinates.x) * ratio,
      y: startNode.coordinates.y + (endNode.coordinates.y - startNode.coordinates.y) * ratio
    };
  };

  const avatarPos = getAvatarPosition(state.totalKms);

  // Center camera on the ringbearer avatar on initial load (when username is available and map viewport is ready)
  useEffect(() => {
    if (state.username && viewportSize.width > 0) {
      const timer = setTimeout(() => {
        panToCoordinate(avatarPos.x, avatarPos.y, mapScale);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [state.username, viewportSize.width > 0]);

  // Slow animated display Kms so that the avatar walks smoothly and the path draws in perfect sync with them
  const [displayedKms, setDisplayedKms] = useState(state.totalKms);

  useEffect(() => {
    if (Math.abs(state.totalKms - displayedKms) < 0.01) {
      setDisplayedKms(state.totalKms);
      return;
    }

    const startValue = displayedKms;
    const endValue = state.totalKms;
    const duration = 4500; // 4.5 seconds
    const startTime = performance.now();
    let animId: number;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Beautiful easeInOutQuad for cinematic movement matching Framer Motion's defaults
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentValue = startValue + (endValue - startValue) * ease;
      setDisplayedKms(parseFloat(currentValue.toFixed(3)));

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        setDisplayedKms(endValue);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [state.totalKms]);

  const animatedAvatarPos = getAvatarPosition(displayedKms);

  // Generate points representing the path already walked by the user, leading to their current avatar position
  const getWalkedRoutePoints = (currentDist: number): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = [];
    
    // Add all milestones that the user has already fully reached
    MILESTONES.forEach(m => {
      if (currentDist >= m.distance) {
        points.push(m.coordinates);
      }
    });
    
    // Add the current avatar position as the latest active point
    if (points.length === 0) {
      points.push(MILESTONES[0].coordinates);
    }
    
    // If we have some intermediate progress beyond the last unlocked milestone, append the animated avatar position
    const currentAnimatedPos = getAvatarPosition(currentDist);
    const lastMilestoneReached = MILESTONES.filter(m => currentDist >= m.distance).pop();
    if (lastMilestoneReached) {
      const isExactlyOnMilestone = currentDist === lastMilestoneReached.distance;
      if (!isExactlyOnMilestone) {
        points.push(currentAnimatedPos);
      }
    } else {
      // In case we haven't reached the first milestone but have walked some meters
      if (currentDist > 0) {
        points.push(currentAnimatedPos);
      }
    }
    
    return points;
  };

  const walkedPoints = getWalkedRoutePoints(displayedKms);

  // Play stepping footsteps sound effect while displayedKms is actively moving (not yet caught up)
  useEffect(() => {
    if (displayedKms === state.totalKms) return;
    
    // Play a step immediately
    playStepSound();

    // Rhythmic stepping sound every 380ms
    const interval = setInterval(() => {
      playStepSound();
    }, 380);

    return () => clearInterval(interval);
  }, [displayedKms === state.totalKms]);

  // Get current region / companion metadata (Catalan localized)
  const getCompanionName = () => {
    if (state.totalKms >= 2863) return "Cap, l'Anell és al foc!";
    const name = state.username || "Frodo";
    if (state.totalKms < 40) {
      return state.avatarId === "sam" ? `${name} i Frodo` : `${name} i Sam`;
    }
    if (state.totalKms < 390) return `Gambús, ${name} i els Hòbbits`;
    if (state.totalKms < 1400) return "La Germandat de l'Anell";
    if (state.totalKms < 2100) return `${name} i Gòl·lum (Sméagol)`;
    return state.avatarId === "sam" ? `${name} i Frodo` : `Sam i tu (${name})`;
  };

  const getCurrentRegion = () => {
    if (state.totalKms >= 2863) return "Esquerdes del Destí, Mórdor";
    if (state.totalKms < 217) return "La Comarca (Caminant cap a Bree)";
    if (state.totalKms < 386) return "Terres de Bree (Camí de la Sota del Vent)";
    if (state.totalKms < 737) return "Turons de la Sota del Vent (Ruta a Rivendell)";
    if (state.totalKms < 1000) return "Rivendell (Ruta cap a les Mines de Mòria)";
    if (state.totalKms < 1263) return "Mines de Mòria (Sota les Muntanyes Boiroses)";
    if (state.totalKms < 1867) return "Lothlórien (El Bosc Daurat de Galàdriel)";
    if (state.totalKms < 2100) return "Amon Hen (Creuant el riu Anduin)";
    if (state.totalKms < 2200) return "Els Marjals Morts (Seguint en Gòl·lum)";
    return "La Porta Negra (Altiplà desolat de Gorgoroth, Mórdor)";
  };

  // Background music effect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentRegion = getCurrentRegion();
    const bgmUrl = REGION_BG_MUSIC[currentRegion];

    if (!bgmUrl) {
      if (bgMusic) {
        bgMusic.pause();
        setBgMusic(null);
      }
      return;
    }

    // If there is already music playing, check if it's the same URL
    if (bgMusic) {
      if (bgMusic.src.endsWith(encodeURI(bgmUrl)) || bgMusic.src.endsWith(bgmUrl)) {
        // Same song, keep playing if unmuted
        if (!isBgMuted) {
          bgMusic.play().catch(e => console.log("BGM play failed", e));
        } else {
          bgMusic.pause();
        }
        return;
      } else {
        // Different song, pause and destroy old one
        bgMusic.pause();
      }
    }

    const audio = new Audio(bgmUrl);
    audio.loop = true;
    audio.volume = 0.15; // Soft ambient background volume

    if (!isBgMuted) {
      audio.play().catch(err => {
        console.log("Autoplay background music blocked, waiting for user gesture.", err);
      });
    }

    setBgMusic(audio);

    return () => {
      audio.pause();
    };
  }, [getCurrentRegion(), isBgMuted]);

  const handleToggleMuteBg = () => {
    playClickSound();
    setIsBgMuted(prev => !prev);
  };

  // Add Walk distance handler
  const handleAddWalk = (kms: number, customNote?: string) => {
    if (isNaN(kms) || kms <= 0) return;
    if (state.totalKms >= 2863) return; // Hard stop at end of journey

    playClickSound();

    // Check 42 km daily limit
    const today = new Date();
    const todayDateStr = today.toDateString();
    const kmsLoggedToday = state.logs
      .filter(l => {
        const ms = parseInt(l.id.replace("log_", ""), 10);
        if (isNaN(ms)) return false;
        const d = new Date(ms);
        return d.toDateString() === todayDateStr;
      })
      .reduce((sum, l) => sum + l.kmsAdded, 0);

    if (kmsLoggedToday + kms > DAILY_KM_LIMIT) {
      setDailyLimitError(`Atenció Hòbit! Has superat el límit diari recomanat de resistència. Només es permet un màxim de ${DAILY_KM_LIMIT} km de caminada per dia per evitar la fatiga extrema. Avui ja has registrat ${kmsLoggedToday.toFixed(1)} km.`);
      return;
    }

    // Limit next total to Mount Doom maximum
    const targetDistance = 2863;
    const prospectiveDistance = state.totalKms + kms;
    const finalKmsToAdd = prospectiveDistance > targetDistance ? parseFloat((targetDistance - state.totalKms).toFixed(3)) : kms;
    const newDistance = parseFloat(Math.min(targetDistance, state.totalKms + finalKmsToAdd).toFixed(3));

    // Check newly unlocked milestones
    const newlyUnlocked: string[] = [...state.unlockedMilestones];
    let milestoneToTrigger: Milestone | null = null;

    MILESTONES.forEach(m => {
      if (newDistance >= m.distance && !state.unlockedMilestones.includes(m.id)) {
        newlyUnlocked.push(m.id);
        milestoneToTrigger = m; 
      }
    });

    // Approximate fitness stats (1 km = 1320 steps, 60 kcal)
    const computedSteps = Math.round(finalKmsToAdd * 1320);
    const computedCalories = Math.round(finalKmsToAdd * 60);

    const defaultNotes = [
      "Passeig matinal pel camí est",
      "Marxa lleugera esquivant hòsties d'orcs",
      "Senderisme sota els arbres daurats",
      "Caminada recollint provisions de viatge",
      "Avançant sota la mirada vigilant de l'ull"
    ];
    const randomNote = defaultNotes[Math.floor(Math.random() * defaultNotes.length)];

    const newLog: ActivityLog = {
      id: "log_" + Date.now(),
      timestamp: new Date().toLocaleDateString("ca-ES", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      kmsAdded: parseFloat(finalKmsToAdd.toFixed(2)),
      steps: computedSteps,
      calories: computedCalories,
      note: customNote || noteVal || randomNote
    };

    setState(prev => ({
      ...prev,
      totalKms: parseFloat(newDistance.toFixed(3)),
      unlockedMilestones: newlyUnlocked,
      logs: [newLog, ...prev.logs]
    }));

    setNoteVal("");

    // Trigger milestone alert & automatic narration if unlocked
    if (milestoneToTrigger) {
      const mt: Milestone = milestoneToTrigger;
      setTimeout(() => {
        // Play specific contextual sound chime
        if (mt.id === "mount_doom") {
          playVictoryChime();
        } else if (["moria", "dead_marshes", "black_gate"].includes(mt.id)) {
          playDarkChime();
        } else {
          playPeacefulChime();
        }
        
        setActivePopup(mt);
        
        // Auto Play custom audio if provided for the milestone!
        if (mt.audio) {
          playCustomAudio(mt.audio).then((audio) => {
            setPlayingAudio(audio);
            setIsAudioPlaying(true);
            audio.onended = () => {
              setPlayingAudio(null);
              setIsAudioPlaying(false);
            };
          }).catch(err => {
            console.log("Audio autoplay failed, needs user gesture first", err);
          });
        }

        // Center map onto the newly unlocked milestone coordinates
        panToCoordinate(mt.coordinates.x, mt.coordinates.y);
      }, 600);
    }
  };

  // Delete Log handler
  const handleDeleteLog = (logId: string, kms: number) => {
    playClickSound();
    if (playingAudio) {
      playingAudio.pause();
      setPlayingAudio(null);
      setIsAudioPlaying(false);
    }
    setState(prev => {
      const updatedDistance = Math.max(0, parseFloat((prev.totalKms - kms).toFixed(3)));
      // Re-evaluate unlocked milestones
      const recomputedUnlocked = MILESTONES.filter(m => updatedDistance >= m.distance).map(m => m.id);
      if (recomputedUnlocked.length === 0) recomputedUnlocked.push("the_shire");

      return {
        ...prev,
        totalKms: updatedDistance,
        unlockedMilestones: recomputedUnlocked,
        logs: prev.logs.filter(l => l.id !== logId)
      };
    });
  };

  // Reset entire journey
  const handleReset = () => {
    playClickSound();
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    playClickSound();
    if (playingAudio) {
      playingAudio.pause();
      setPlayingAudio(null);
      setIsAudioPlaying(false);
    }
    setState({
      totalKms: 0,
      currentMilestoneId: "the_shire",
      unlockedMilestones: ["the_shire"],
      logs: [],
      username: undefined,
      avatarId: undefined,
      customAvatarUrl: undefined,
      startDate: undefined
    });
    setTempName("");
    setTempAvatarId("frodo");
    setTempCustomAvatarUrl("");
    const initialScale = viewportSize.width < 640 ? 3.0 : 5.5;
    setMapScale(initialScale);
    setMapOffset({ x: -220, y: -110 });
    setActivePopup(null);
    setShowResetConfirm(false);
    setDismissedSplash(false);
  };

  // Pan to milestone coordinates on map click (supports optional customScale override)
  const panToCoordinate = (pctX: number, pctY: number, customScale?: number) => {
    const scale = customScale !== undefined ? customScale : mapScale;
    const width = viewportSize.width;
    const height = viewportSize.height;

    // Calculate base scale to fit the 1200x896 map to the viewport using "cover" logic
    const baseScale = Math.max(width / 1200, height / 896);
    const mapWidth = 1200 * baseScale * scale;
    const mapHeight = 896 * baseScale * scale;

    const targetPixelX = (pctX / 100) * mapWidth;
    const targetPixelY = (pctY / 100) * mapHeight;

    const maxX = Math.max(0, (mapWidth - width) / 2);
    const maxY = Math.max(0, (mapHeight - height) / 2);

    const computedX = -(targetPixelX - (mapWidth / 2));
    const computedY = -(targetPixelY - (mapHeight / 2));

    setMapOffset({
      x: Math.max(-maxX, Math.min(maxX, computedX)),
      y: Math.max(-maxY, Math.min(maxY, computedY))
    });
  };

  // Drag-to-pan implementation
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetStartRef.current = { ...mapOffset };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const width = viewportSize.width;
    const height = viewportSize.height;

    const baseScale = Math.max(width / 1200, height / 896);
    const mapWidth = 1200 * baseScale * mapScale;
    const mapHeight = 896 * baseScale * mapScale;

    const maxX = Math.max(0, (mapWidth - width) / 2);
    const maxY = Math.max(0, (mapHeight - height) / 2);

    setMapOffset({
      x: Math.max(-maxX, Math.min(maxX, offsetStartRef.current.x + dx)),
      y: Math.max(-maxY, Math.min(maxY, offsetStartRef.current.y + dy))
    });
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Touch support for mobile panning and pinch-to-zoom gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      offsetStartRef.current = { ...mapOffset };
      touchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false; // Disable single finger drag
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      touchStartScaleRef.current = mapScale;

      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      touchStartMidRef.current = { x: midX, y: midY };
      touchStartOffsetRef.current = { ...mapOffset };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;

      const width = viewportSize.width;
      const height = viewportSize.height;

      const baseScale = Math.max(width / 1200, height / 896);
      const mapWidth = 1200 * baseScale * mapScale;
      const mapHeight = 896 * baseScale * mapScale;

      const maxX = Math.max(0, (mapWidth - width) / 2);
      const maxY = Math.max(0, (mapHeight - height) / 2);

      setMapOffset({
        x: Math.max(-maxX, Math.min(maxX, offsetStartRef.current.x + dx)),
        y: Math.max(-maxY, Math.min(maxY, offsetStartRef.current.y + dy))
      });
    } else if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      // Prevent browser default zooming behaviors
      if (e.cancelable) {
        e.preventDefault();
      }
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (dist > 5) {
        const factor = dist / touchStartDistRef.current;
        const nextScale = Math.max(0.5, Math.min(12.0, touchStartScaleRef.current * factor));
        const finalScale = parseFloat(nextScale.toFixed(2));

        const rect = mapContainerRef.current?.getBoundingClientRect();
        if (rect && mapScale !== finalScale) {
          const midX = touchStartMidRef.current.x;
          const midY = touchStartMidRef.current.y;
          const focalX = midX - rect.left;
          const focalY = midY - rect.top;
          const viewWidth = viewportSize.width;
          const viewHeight = viewportSize.height;

          const dx = focalX - (viewWidth / 2 + touchStartOffsetRef.current.x);
          const dy = focalY - (viewHeight / 2 + touchStartOffsetRef.current.y);

          const scaleRatio = finalScale / touchStartScaleRef.current;
          const dx_new = dx * scaleRatio;
          const dy_new = dy * scaleRatio;

          const newOffsetX = focalX - dx_new - viewWidth / 2;
          const newOffsetY = focalY - dy_new - viewHeight / 2;

          const baseScale = Math.max(viewWidth / 1200, viewHeight / 896);
          const mapWidth = 1200 * baseScale * finalScale;
          const mapHeight = 896 * baseScale * finalScale;
          const maxX = Math.max(0, (mapWidth - viewWidth) / 2);
          const maxY = Math.max(0, (mapHeight - viewHeight) / 2);

          setMapOffset({
            x: Math.max(-maxX, Math.min(maxX, newOffsetX)),
            y: Math.max(-maxY, Math.min(maxY, newOffsetY))
          });
          setMapScale(finalScale);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchStartDistRef.current = null;
  };

  // Wheel Zoom support for desktop mouse / trackpad
  const handleWheel = (e: React.WheelEvent) => {
    // Zoom relative to mouse cursor
    const zoomIntensity = 0.08;
    const delta = -e.deltaY;
    const factor = delta > 0 ? (1 + zoomIntensity) : (1 - zoomIntensity);

    const S_old = mapScale;
    const nextScale = Math.max(0.5, Math.min(12.0, S_old * factor));
    const finalScale = parseFloat(nextScale.toFixed(2));

    if (S_old === finalScale) return;

    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const focalX = e.clientX - rect.left;
      const focalY = e.clientY - rect.top;
      const viewWidth = viewportSize.width;
      const viewHeight = viewportSize.height;

      const dx = focalX - (viewWidth / 2 + mapOffset.x);
      const dy = focalY - (viewHeight / 2 + mapOffset.y);

      const scaleRatio = finalScale / S_old;
      const dx_new = dx * scaleRatio;
      const dy_new = dy * scaleRatio;

      const newOffsetX = focalX - dx_new - viewWidth / 2;
      const newOffsetY = focalY - dy_new - viewHeight / 2;

      const baseScale = Math.max(viewWidth / 1200, viewHeight / 896);
      const mapWidth = 1200 * baseScale * finalScale;
      const mapHeight = 896 * baseScale * finalScale;
      const maxX = Math.max(0, (mapWidth - viewWidth) / 2);
      const maxY = Math.max(0, (mapHeight - viewHeight) / 2);

      setMapOffset({
        x: Math.max(-maxX, Math.min(maxX, newOffsetX)),
        y: Math.max(-maxY, Math.min(maxY, newOffsetY))
      });
      setMapScale(finalScale);
    }
  };

  // Zoom Adjustment
  const handleZoom = (factor: number) => {
    playClickSound();
    setMapScale(prev => {
      const nextScale = Math.max(0.5, Math.min(12.0, prev + factor));
      if (nextScale === 0.5) {
        setMapOffset({ x: 0, y: 0 });
      }
      return parseFloat(nextScale.toFixed(1));
    });
  };

  // Custom audio player control
  const handlePlayCustomAudio = (milestone: Milestone) => {
    playClickSound();
    if (playingAudio) {
      playingAudio.pause();
      setPlayingAudio(null);
      setIsAudioPlaying(false);
    } else if (milestone.audio) {
      playCustomAudio(milestone.audio).then((audio) => {
        setPlayingAudio(audio);
        setIsAudioPlaying(true);
        audio.onended = () => {
          setPlayingAudio(null);
          setIsAudioPlaying(false);
        };
      }).catch(err => {
        console.warn("Could not play custom audio", err);
        setIsAudioPlaying(false);
      });
    }
  };

  // Pre-pan and enforce auto zoom to current avatar on walk logging or initialization
  useEffect(() => {
    if (!state.username) return;
    
    const targetScale = viewportSize.width < 640 ? 1.6 : 3.0;
    setMapScale(targetScale);
    
    let timer1 = setTimeout(() => {
      panToCoordinate(avatarPos.x, avatarPos.y, targetScale);
    }, 150);

    let timer2 = setTimeout(() => {
      panToCoordinate(avatarPos.x, avatarPos.y, targetScale);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [state.totalKms, state.username, viewportSize.width, viewportSize.height]);

  // Recenter offset when mapScale or viewportSize changes to ensure we clamp mapOffset within boundaries
  useEffect(() => {
    const width = viewportSize.width;
    const height = viewportSize.height;
    const baseScale = Math.max(width / 1200, height / 896);
    const mapWidth = 1200 * baseScale * mapScale;
    const mapHeight = 896 * baseScale * mapScale;

    const maxX = Math.max(0, (mapWidth - width) / 2);
    const maxY = Math.max(0, (mapHeight - height) / 2);

    setMapOffset(prev => ({
      x: Math.max(-maxX, Math.min(maxX, prev.x)),
      y: Math.max(-maxY, Math.min(maxY, prev.y))
    }));
  }, [mapScale, viewportSize]);

  // Compute stats calculations grouped by calendar day (merging multiple walks on the same day)
  const getGroupedByDayStats = () => {
    if (state.logs.length === 0) {
      return {
        numActiveDays: 0,
        avgKmsGrouped: 0,
        avgStepsGrouped: 0,
        avgKcalGrouped: 0,
        bestDayGrouped: 0
      };
    }

    const daysMap: { [dateKey: string]: { kms: number; steps: number; calories: number } } = {};
    
    state.logs.forEach(l => {
      const ms = parseInt(l.id.replace("log_", ""), 10);
      const d = new Date(isNaN(ms) ? Date.now() : ms);
      const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      
      if (!daysMap[dateKey]) {
        daysMap[dateKey] = { kms: 0, steps: 0, calories: 0 };
      }
      daysMap[dateKey].kms += l.kmsAdded;
      daysMap[dateKey].steps += l.steps || Math.round(l.kmsAdded * 1320);
      daysMap[dateKey].calories += l.calories || Math.round(l.kmsAdded * 60);
    });

    const dailyValues = Object.values(daysMap);
    const numActiveDays = dailyValues.length;

    const totalKmsGrouped = state.totalKms;
    const avgKmsGrouped = numActiveDays > 0 ? parseFloat((totalKmsGrouped / numActiveDays).toFixed(1)) : 0;
    
    const totalStepsGrouped = dailyValues.reduce((acc, d) => acc + d.steps, 0);
    const avgStepsGrouped = numActiveDays > 0 ? Math.round(totalStepsGrouped / numActiveDays) : 0;
    
    const totalKcalGrouped = dailyValues.reduce((acc, d) => acc + d.calories, 0);
    const avgKcalGrouped = numActiveDays > 0 ? Math.round(totalKcalGrouped / numActiveDays) : 0;
    
    const bestDayGrouped = dailyValues.length > 0 ? parseFloat(Math.max(...dailyValues.map(d => d.kms)).toFixed(1)) : 0;

    return {
      numActiveDays,
      avgKmsGrouped,
      avgStepsGrouped,
      avgKcalGrouped,
      bestDayGrouped
    };
  };

  const groupedStats = getGroupedByDayStats();

  const getJourneyDaysCount = (): number => {
    if (!state.startDate) return 1;
    const start = new Date(state.startDate);
    const now = new Date();
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = today.getTime() - startDay.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  };

  const getWalkedDaysCount = (): number => {
    const daysSet = new Set<string>();
    state.logs.forEach(l => {
      const ms = parseInt(l.id.replace("log_", ""), 10);
      const d = new Date(isNaN(ms) ? Date.now() : ms);
      daysSet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return daysSet.size;
  };

  const totalKms = state.totalKms;
  const numLogs = state.logs.length;
  const totalSteps = state.logs.reduce((acc, l) => acc + (l.steps || Math.round(l.kmsAdded * 1320)), 0);
  const totalKcal = state.logs.reduce((acc, l) => acc + (l.calories || Math.round(l.kmsAdded * 60)), 0);

  // Streak calculations
  const getStreakStats = () => {
    if (state.logs.length === 0) return { current: 0, max: 0 };
    
    const days: number[] = state.logs.map(l => {
      const ms = parseInt(l.id.replace("log_", ""), 10);
      const d = new Date(isNaN(ms) ? Date.now() : ms);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    });
    
    const uniqueDays: number[] = Array.from(new Set(days)).sort((a: number, b: number) => a - b);
    
    let maxStreak = 0;
    let tempStreak = 0;
    
    const oneDayMs = 24 * 60 * 60 * 1000;
    const today = new Date();
    const todayMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const yesterdayMs = todayMs - oneDayMs;
    
    for (let i = 0; i < uniqueDays.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const diff = uniqueDays[i] - uniqueDays[i - 1];
        if (diff <= oneDayMs + 3600000) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
    }
    
    const hasToday = uniqueDays.includes(todayMs);
    const hasYesterday = uniqueDays.includes(yesterdayMs);
    let currentStreak = 0;
    
    if (hasToday || hasYesterday) {
      let streakCount = 1;
      let index = uniqueDays.length - 1;
      
      while (index > 0) {
        const diff = uniqueDays[index] - uniqueDays[index - 1];
        if (diff <= oneDayMs + 3600000) {
          streakCount++;
          index--;
        } else {
          break;
        }
      }
      currentStreak = streakCount;
    }
    
    return { current: currentStreak, max: Math.max(maxStreak, currentStreak) };
  };

  const streak = getStreakStats();

  // Progress Bar Calculations
  // A. Progress until the next milestone
  const getNextMilestoneProgress = () => {
    if (state.totalKms >= 2863) return { progress: 100, nextM: null, prevM: null };
    
    const nextM = MILESTONES.find(m => m.distance > state.totalKms) || null;
    if (!nextM) return { progress: 100, nextM: null, prevM: null };

    // Find previous milestone (the highest distance milestone <= totalKms)
    const prevM = [...MILESTONES].reverse().find(m => m.distance <= state.totalKms) || MILESTONES[0];
    
    const segmentDist = nextM.distance - prevM.distance;
    if (segmentDist <= 0) return { progress: 0, nextM, prevM };
    
    const walkedInSegment = state.totalKms - prevM.distance;
    const progress = Math.min(100, Math.max(0, (walkedInSegment / segmentDist) * 100));
    
    return { progress: parseFloat(progress.toFixed(1)), nextM, prevM };
  };

  const nextMilestoneInfo = getNextMilestoneProgress();

  // Filter milestones: You can only watch milestones you have already reached
  const visibleMilestones = MILESTONES.filter(m => state.totalKms >= m.distance);

  // Triggering handleAddWalk from the dropdown selections
  const handleLogDropdownWalk = () => {
    const totalSelected = selectedKm + (selectedMeters / 1000);
    if (totalSelected <= 0) return;
    handleAddWalk(totalSelected);
    setShowAddWalkModal(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempCustomAvatarUrl(reader.result as string);
      setTempAvatarId("custom");
      playClickSound();
    };
    reader.readAsDataURL(file);
  };

  // If Mount Doom reached, show Splash Screen
  const isFinished = state.totalKms >= 2863;
  const showSplash = isFinished && !dismissedSplash;

  return (
    <div className="flex flex-col h-full bg-[#1b1210] text-[#ebe0de] font-sans" id="compose-app-sim">
      
      {/* Jetpack Compose Styled Top App Bar */}
      {state.username && state.avatarId && (
        <div className="flex items-center justify-between bg-[#2c1b18] border-b border-[#3c2a26] px-4 py-3 shadow-md shrink-0">
          <div className="flex items-center">
            {/* TOP BAR LOGO IMAGE AS THE APP TITLE/BRANDING PLACEHOLDER */}
            <img 
              src={TOP_APP_BAR_LOGO_URL} 
              alt="Logo de l'Aplicació" 
              className="h-8 md:h-9 object-contain rounded-md" 
              referrerPolicy="no-referrer"
            />
          </div>
          <p 
            onClick={() => { playClickSound(); setShowDevTools(prev => !prev); }}
            className="text-[10px] text-[#b09893] hover:text-[#e6c280] font-medium font-mono leading-none cursor-pointer transition-colors flex items-center gap-1 select-none"
            title="Activar/Desactivar controls de proves"
            id="dev-tools-toggle"
          >
            SIMULADOR JETPACK COMPOSE {showDevTools ? "🛠️" : ""}
          </p>
        </div>
      )}

      {/* Main Screen Layout (Simulator Content) */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        
        {!state.username || !state.avatarId ? (
          /* --- Character Selection Setup Screen --- */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#160d0b] z-40 flex flex-col items-center justify-start p-6 overflow-y-auto"
            id="character-setup-screen"
          >
            <div className="w-full max-w-sm my-auto flex flex-col gap-5 text-center py-4">
              <div className="flex flex-col gap-1 items-center">
                {/* APP LOGO PLACEHOLDER: Change the APP_LOGO_URL constant at the top of this file to swap out this image */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#df5a3e] to-amber-400 p-0.5 shadow-[0_0_20px_rgba(223,90,62,0.3)] flex items-center justify-center overflow-hidden mb-3">
                  <img 
                    src={APP_LOGO_URL} 
                    alt="Logo de l'Anell" 
                    className="w-full h-full object-cover rounded-full" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h1 className="font-serif font-black text-xl text-[#e6c280] tracking-wide mt-2">
                  Crea el teu Viatger!
                </h1>
                <p className="text-[11px] text-[#b09893] max-w-xs leading-relaxed">
                  Abans de començar la gran missió per destruir l'Anell Únic a les esquerdes del volcà, tria el teu personatge i defineix el teu nom.
                </p>
              </div>

              {/* Input for traveler name */}
              <div className="bg-[#211614] border border-[#3e2b27] p-3.5 rounded-2xl text-left flex flex-col gap-1.5 shadow-inner">
                <label className="text-[9px] text-[#e6c280] font-mono uppercase tracking-wider pl-0.5 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#df5a3e]" /> Nom del portador de l'Anell
                </label>
                <input 
                  type="text"
                  placeholder="Ex: Frodo Saquet, Aragorn, etc."
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full text-xs font-serif bg-[#160d0b] border border-[#3e2b27] rounded-xl px-3 py-2.5 text-white placeholder-[#5c4743] outline-none focus:border-[#e6c280] focus:ring-1 focus:ring-[#e6c280] transition-all"
                  id="setup-name-input"
                  maxLength={30}
                />
              </div>

              {/* Avatar Selector Grid */}
              <div className="bg-[#211614] border border-[#3e2b27] p-3.5 rounded-2xl text-left flex flex-col gap-2.5 shadow-inner">
                <label className="text-[9px] text-[#e6c280] font-mono uppercase tracking-wider pl-0.5 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#df5a3e]" /> Selecciona el teu Avatar
                </label>
                
                {/* 3x2 Grid of Presets */}
                <div className="grid grid-cols-3 gap-1.5">
                  {AVATAR_OPTIONS.map((avatar) => {
                    const isSelected = tempAvatarId === avatar.id;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => { playClickSound(); setTempAvatarId(avatar.id); }}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-[#df5a3e]/15 border-[#df5a3e] shadow-[0_0_6px_rgba(223,90,62,0.25)]" 
                            : "bg-[#160d0b] border-[#3e2b27] hover:border-[#8c736e]"
                        }`}
                        id={`setup-avatar-btn-${avatar.id}`}
                      >
                        <span className="text-xl">{avatar.emoji}</span>
                        <span className="text-[9px] font-bold text-white tracking-tight block truncate w-full">
                          {avatar.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* File upload for custom picture */}
                <div className="h-[1px] bg-[#3e2c28]/40 my-1" />
                
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-white block">Imatge pròpia</span>
                    <span className="text-[8px] text-[#b09893] leading-tight block mt-0.5">
                      Penja una foto teva per al viatge.
                    </span>
                  </div>

                  <div className="relative shrink-0">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarUpload} 
                      className="hidden" 
                      id="custom-avatar-file-input"
                    />
                    <label 
                      htmlFor="custom-avatar-file-input"
                      className={`px-2.5 py-1.5 border rounded-xl font-bold text-[9px] flex items-center gap-1 cursor-pointer transition-all ${
                        tempAvatarId === "custom" 
                          ? "bg-[#df5a3e] text-[#1b110f] border-[#df5a3e]" 
                          : "bg-[#160d0b] border-[#3e2b27] text-[#e6c280] hover:bg-[#251715]"
                      }`}
                    >
                      <Camera className="w-2.5 h-2.5" />
                      {tempAvatarId === "custom" ? "Imatge Pujada" : "Puja Foto"}
                    </label>
                  </div>
                </div>

                {/* Show thumbnail if custom uploaded avatar is chosen */}
                {tempAvatarId === "custom" && tempCustomAvatarUrl && (
                  <div className="flex items-center gap-2 bg-[#160d0b] p-2 border border-[#df5a3e]/30 rounded-xl mt-1 animate-fadeIn">
                    <img 
                      src={tempCustomAvatarUrl} 
                      className="w-8 h-8 rounded-full object-cover border border-[#df5a3e]" 
                      referrerPolicy="no-referrer"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] text-[#e6c280] font-mono block truncate">Foto del Viatger</span>
                      <span className="text-[8px] text-emerald-400 block mt-0.5">Retrat llest</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setTempAvatarId("frodo");
                        setTempCustomAvatarUrl("");
                      }}
                      className="text-[8px] text-[#8c736e] hover:text-[#df5a3e] font-mono uppercase tracking-wide cursor-pointer hover:underline shrink-0"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={!tempName.trim()}
                onClick={() => {
                  playPeacefulChime();
                  setState(prev => ({
                    ...prev,
                    username: tempName.trim(),
                    avatarId: tempAvatarId,
                    customAvatarUrl: tempCustomAvatarUrl || undefined,
                    startDate: new Date().toISOString()
                  }));
                }}
                className={`w-full py-3 font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                  tempName.trim()
                    ? "bg-[#df5a3e] text-[#1b110f] hover:bg-[#ff7b5a]"
                    : "bg-neutral-800 text-neutral-500 border border-neutral-700/30 cursor-not-allowed"
                }`}
                id="start-adventure-btn"
              >
                <span>Comença el camí cap a Mórdor</span>
                <span>💍</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* If complete, show epic one-way completion splash screen overlay */}
        <AnimatePresence>
          {showSplash && (
            <motion.div 
              id="completion-splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0e0706] z-50 flex flex-col justify-center items-center p-6 text-center overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", duration: 1.2 }}
                className="max-w-md flex flex-col items-center gap-4 py-8"
              >
                {/* Glowing Sauron eye collapsing or Ring dissolving */}
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#df5a3e] to-amber-400 p-1 shadow-[0_0_40px_rgba(223,90,62,0.6)] animate-pulse flex items-center justify-center">
                  <span className="text-5xl">🌋</span>
                </div>

                <span className="text-xs font-mono font-black text-amber-400 tracking-[3px] uppercase mt-2">
                  VIATGE COMPLETAT
                </span>

                <h1 className="font-serif font-black text-3xl text-white tracking-tight leading-tight">
                  L'Anell Únic ha estat destruït!
                </h1>

                <p className="text-xs text-[#b09893] font-mono leading-relaxed max-w-xs">
                  Has recorregut els <span className="text-[#e6c280] font-bold">2.932 km</span> des de la Comarca fins a les esquerdes del volcà Orodruin.
                </p>

                {/* Tolkien quotation card */}
                <div className="bg-[#1b110f] border border-amber-500/20 rounded-2xl p-4 my-2 shadow-inner text-left relative">
                  <p className="text-xs text-[#d4c3c0] italic font-serif leading-relaxed text-center">
                    "I llavors, de cop, la cendra es va obrir i l'Anell es va fondre en el foc líquid del volcà. El Senyor Fosc es va ensorrar, i la Terra Mitjana es va lliurar de les ombres per sempre."
                  </p>
                  <p className="text-[9px] font-bold text-right text-amber-500/70 font-sans mt-3">
                    — J.R.R. Tolkien, El Senyor dels Anells
                  </p>
                </div>

                {/* Companion Victory Log */}
                <p className="text-xs text-[#8c736e] font-sans italic px-4 leading-relaxed">
                  Felicitats! La teva perseverança de ferro ha completat la missió històrica del Portador de l'Anell. Has salvat la Terra Mitjana caminant pas a pas.
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-2 w-full px-6 mt-4">
                  <button
                    onClick={() => handlePlayCustomAudio(MILESTONES[MILESTONES.length - 1])}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                      isAudioPlaying 
                        ? "bg-amber-500 text-black animate-pulse" 
                        : "bg-[#df5a3e] text-[#1b110f] hover:bg-[#ff7b5a]"
                    }`}
                    id="splash-audio-btn"
                  >
                    {isAudioPlaying ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        Aturar àudio final
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Escolta l'àudio final
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => { playClickSound(); setDismissedSplash(true); }}
                    className="w-full py-2.5 bg-[#2c1b18] hover:bg-[#3d2723] text-[#e6c280] border border-[#4d322c] rounded-xl text-xs font-bold transition-all cursor-pointer mt-1"
                    id="splash-dismiss-btn"
                  >
                    Tancar i veure el diari de ruta
                  </button>


                  <button
                    onClick={handleReset}
                    className="w-full py-2 bg-transparent text-[#8c736e] hover:text-white border border-[#2b1e1b] rounded-xl text-[11px] font-semibold hover:bg-white/5 transition-all cursor-pointer mt-1"
                    id="splash-reset-btn"
                  >
                    Torna a començar una nova aventura
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Map Section */}
        <div 
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onWheel={handleWheel}
          className="flex-1 overflow-hidden relative bg-[#130d0c] cursor-grab active:cursor-grabbing select-none"
          id="map-viewport"
        >
          {/* Map Surface containing Map Image and overlays */}
          <div 
            className="absolute transition-transform duration-200 ease-out origin-center animate-fade-in"
            style={{
              width: "1200px",
              height: "896px",
              left: "50%",
              top: "50%",
              marginLeft: "-600px",
              marginTop: "-448px",
              transform: `translate3d(${mapOffset.x}px, ${mapOffset.y}px, 0px) scale(${Math.max(viewportSize.width / 1200, viewportSize.height / 896) * mapScale})`,
              background: `
                radial-gradient(circle, transparent 65%, rgba(45, 30, 20, 0.45) 100%),
                radial-gradient(circle at 68% 32%, rgba(135, 175, 105, 0.28) 0%, transparent 45%),
                radial-gradient(circle at 35% 25%, rgba(145, 180, 115, 0.22) 0%, transparent 35%),
                radial-gradient(circle at 85% 75%, rgba(185, 120, 95, 0.28) 0%, transparent 28%),
                linear-gradient(to right, rgba(140, 185, 195, 0.38) 0%, rgba(140, 185, 195, 0.25) 22%, rgba(242, 230, 202, 0.1) 32%, rgba(242, 230, 202, 0) 50%),
                #f2e6ca
              `,
              boxShadow: "0 0 40px rgba(0, 0, 0, 0.65)",
              borderRadius: "4px",
            }}
          >
            {/* Massive Map Image */}
            <img 
              src={mapImg} 
              alt="Mapa de la Terra Mitjana" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-fill pointer-events-none select-none filter sepia-[0.12] brightness-[0.9] contrast-[1.12]"
              style={{
                imageRendering: "auto",
              }}
            />

            {/* SVG overlay containing the walked route dotted path segments */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-10" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              {walkedPoints.length > 1 && (
                <polyline
                  points={walkedPoints.map(p => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="#df5a3e"
                  strokeWidth="0.35"
                  strokeDasharray="0.7,0.7"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0px 0.5px 0.5px rgba(0,0,0,0.95))" }}
                />
              )}
            </svg>

             {/* Milestones overlay markers: ONLY show visible (already reached) ones! */}
             {visibleMilestones.map((m) => {
               const isMinor = !!m.isMinor;
               return (
                 <button
                   key={m.id}
                   id={`milestone-marker-${m.id}`}
                   onClick={() => {
                     playClickSound();
                     setActivePopup(m);
                     panToCoordinate(m.coordinates.x, m.coordinates.y);
                   }}
                   className="absolute group z-10 cursor-pointer outline-none focus:outline-none"
                   style={{
                     left: `${m.coordinates.x}%`,
                     top: `${m.coordinates.y}%`,
                     transform: `translate(-50%, -50%) scale(${isMinor ? 1.4 / mapScale : 2.4 / mapScale})`,
                   }}
                 >
                   {isMinor ? (
                     /* Minor Milestone: Smaller, elegant silver/amber dot */
                     <div className="relative flex items-center justify-center w-3 h-3 rounded-full border border-amber-300 bg-[#160d0b] shadow-[0_0_4px_rgba(217,119,6,0.8)] transition-all duration-300 group-hover:scale-110">
                       <div className="w-1 h-1 rounded-full bg-amber-400 z-10" />
                     </div>
                   ) : (
                     /* Major Milestone: Larger, glowing golden/amber master icon */
                     <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#e6c280] bg-[#1b110f] shadow-[0_0_8px_rgba(230,194,128,0.95)] transition-all duration-300 group-hover:scale-110">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#e6c280] animate-ping absolute" />
                       <div className="w-2 h-2 rounded-full bg-[#df5a3e] z-10" />
                     </div>
                   )}

                   {/* Elegant text label - styled to stay perfectly legible and constant physical size */}
                   <span className="absolute top-5 left-1/2 -translate-x-1/2 bg-[#1b110f]/95 text-[10px] font-serif font-bold text-center border px-2 py-0.5 rounded-md shadow-xl whitespace-nowrap pointer-events-none text-[#e6c280] border-amber-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
                     {m.name} ({m.distance} km)
                   </span>
                 </button>
               );
             })}

            {/* Animated Ringbearer Avatar Token - perfectly synchronized with path */}
            <div 
              id="avatar-token"
              className="absolute z-20 pointer-events-none"
              style={{
                left: `${animatedAvatarPos.x}%`,
                top: `${animatedAvatarPos.y}%`,
                transform: `translate(-50%, -50%) scale(${1.8 / mapScale})`,
              }}
            >
              {/* Golden ring visual aura - elegant, premium and clear */}
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#ffd79e] to-[#c2964b] border-2 border-amber-300 shadow-[0_0_12px_rgba(230,194,128,0.95)] animate-pulse">
                <div className="w-9.5 h-9.5 rounded-full bg-[#1b110f] flex items-center justify-center text-xl overflow-hidden">
                  {state.avatarId === "custom" && state.customAvatarUrl ? (
                    <img src={state.customAvatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="" />
                  ) : (
                    AVATAR_OPTIONS.find(a => a.id === state.avatarId)?.emoji || "🧑‍🌾"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Music Player Control (Floating top-left of Viewport) */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2" id="bg-music-control">
            <button
              onClick={handleToggleMuteBg}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95 ${
                isBgMuted 
                  ? "bg-[#2c1b18]/90 border-[#4d322c] text-[#b09893] hover:text-[#e6c280] hover:border-[#ffd79e]" 
                  : "bg-[#df5a3e]/90 border-amber-300 text-[#1b110f] hover:bg-[#ff7b5a]"
              }`}
              title={isBgMuted ? "Activar música ambient de la regió" : "Silenciar música ambient"}
              id="bgm-toggle-btn"
            >
              {isBgMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-bounce" />}
            </button>
            
            {/* Smooth slide-in track details when active */}
            <AnimatePresence>
              {!isBgMuted && (
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.95 }}
                  className="bg-[#2c1b18]/90 border border-[#4d322c] px-3 py-1.5 rounded-xl text-[11px] text-white flex flex-col justify-center shadow-lg font-sans max-w-[200px]"
                  id="bgm-track-info"
                >
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[9px] font-mono leading-none">Música Ambient</span>
                  <span className="truncate font-medium text-white mt-1 leading-none">
                    {getCurrentRegion() === "La Comarca (Caminant cap a Bree)" ? "La Comarca 🎶" : "Cançó de la Regió 🎵"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Map Controls (Floating inside Viewport) */}
          <div className="absolute bottom-4 left-4 z-30" id="map-zoom-controls">
            <button 
              onClick={() => {
                playClickSound();
                const targetScale = viewportSize.width < 640 ? 3.0 : 5.5;
                setMapScale(targetScale);
                panToCoordinate(avatarPos.x, avatarPos.y, targetScale);
              }}
              className="w-12 h-12 rounded-full bg-[#2c1b18]/95 border-2 border-[#4d322c] flex items-center justify-center text-[#e6c280] hover:bg-[#3c2a26] hover:border-[#ffd79e] transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95"
              title="Troba el Portador"
              id="center-avatar-btn"
            >
              <Compass className="w-6 h-6 animate-pulse" />
            </button>
          </div>

          {/* Bottom-Right Floating Action Bubbles (FABs) */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2.5 z-30" id="map-fabs-controls">
            {/* Diary / Quill Bubble */}
            <button
              onClick={() => { playClickSound(); setShowLogs(true); }}
              className="w-12 h-12 rounded-full bg-[#2c1b18]/95 border-2 border-[#4d322c] flex items-center justify-center text-[#e6c280] hover:bg-[#3c2a26] hover:border-[#ffd79e] transition-all cursor-pointer shadow-2xl relative group hover:scale-110 active:scale-95"
              title="Obrir Diari de Ruta i dades"
              id="fab-diary-btn"
            >
              <Book className="w-5.5 h-5.5" />
              {state.logs.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#df5a3e] text-[#1b110f] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#2c1b18]">
                  {state.logs.length}
                </span>
              )}
            </button>

            {/* Km Register Bubble with Plus (+) icon */}
            {!isFinished && (
              <button
                onClick={() => { playClickSound(); setShowAddWalkModal(true); }}
                className="w-12 h-12 rounded-full bg-[#df5a3e] border-2 border-amber-300 flex items-center justify-center text-[#1b110f] hover:bg-[#ff7b5a] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-2xl"
                title="Registrar nova caminada"
                id="fab-add-walk-btn"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
              </button>
            )}
          </div>

          {/* Mini HUD Stats Overlay (Floating inside top-right of Viewport, collapsible) */}
          <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-1.5" id="hud-stats-container">
            {/* Toggle Button for HUD */}
            <button
              onClick={() => { playClickSound(); setShowHud(prev => !prev); }}
              className="w-8 h-8 rounded-full bg-[#2c1b18]/95 border border-[#4a3430] flex items-center justify-center text-[#e6c280] hover:bg-[#3c2a26] hover:border-[#ffd79e] transition-all cursor-pointer shadow-xl"
              title={showHud ? "Amagar estat de recerca" : "Mostrar estat de recerca"}
              id="toggle-hud-btn"
            >
              {showHud ? (
                <span className="text-xs font-mono font-bold">✕</span>
              ) : (
                <Sparkles className="w-4 h-4 text-[#ffd79e] animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {showHud && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-[#231715]/95 border border-[#3e2c28] px-3 py-2.5 rounded-xl text-left select-none text-[11px] w-[180px] shadow-2xl font-mono flex flex-col gap-1 relative"
                  id="hud-content"
                >
                  <div className="flex items-center gap-1.5 text-[#e6c280] font-bold border-b border-[#3e2c28] pb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>ESTAT DE RECERCA</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1 text-[#b09893]">
                    <div>Regió: <span className="text-white text-[10px] font-sans font-medium block mt-0.5">{getCurrentRegion()}</span></div>
                    <div>Companyia: <span className="text-white text-[10px] font-sans font-medium block mt-0.5">{getCompanionName()}</span></div>
                    <div>Següent fita: <span className="text-amber-400 text-[10px] font-sans font-medium block mt-0.5">
                      {MILESTONES.find(m => state.totalKms < m.distance)?.name || "Mórdor assolit!"}
                    </span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Panel (Progress & Quest Summary) */}
        <div className="shrink-0 bg-[#231715] border-t border-[#3c2a26] p-4 flex flex-col gap-3 relative z-30 shadow-inner">
          
          {/* Progress Bars Section - Two Progress Bars as requested! */}
          <div className="flex flex-col gap-2.5 bg-[#170e0c] p-3 rounded-xl border border-amber-950/20">
            
            {/* ProgressBar 1: Until the next milestone */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                <span className="text-[#e6c280] font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#df5a3e]" />
                  Fins a {nextMilestoneInfo.nextM ? nextMilestoneInfo.nextM.name : "la propera fita"}:
                </span>
                <span className="font-bold text-white text-[10px]">
                  {nextMilestoneInfo.nextM 
                    ? `${state.totalKms} / ${nextMilestoneInfo.nextM.distance} km` 
                    : "Missions completades!"
                  }
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#0d0706] p-0.5 overflow-hidden">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${nextMilestoneInfo.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              {nextMilestoneInfo.nextM && (
                <div className="flex justify-between text-[9px] text-[#8c736e] font-mono">
                  <span className="text-amber-500 font-bold">{nextMilestoneInfo.progress}% completat</span>
                  <span>Queden {(nextMilestoneInfo.nextM.distance - state.totalKms).toFixed(1)} km per arribar-hi</span>
                </div>
              )}
            </div>

            <div className="h-[1px] bg-amber-950/20" />

            {/* ProgressBar 2: Until the end of the journey (2,863 km) */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                <span className="text-[#b09893] flex items-center gap-1 font-semibold">
                  <Compass className="w-3 h-3 text-emerald-500" />
                  Fins al Mont del Destí:
                </span>
                <span className="font-bold text-[#e6c280] text-[10px]">
                  {state.totalKms} / 2.863 km
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#0d0706] p-0.5 overflow-hidden">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-[#df5a3e] to-[#ff7b5a]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (state.totalKms / 2863) * 100)}%` }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-[#8c736e] font-mono">
                <span className="text-emerald-500 font-bold">{((state.totalKms / 2863) * 100).toFixed(1)}% de la ruta</span>
                <span>Queden {(2863 - state.totalKms).toFixed(1)} km totals</span>
              </div>
            </div>

          </div>

          {isFinished && (
            <div className="bg-[#170e0c]/80 border border-emerald-500/20 rounded-2xl p-3.5 text-center flex flex-col gap-1 items-center justify-center animate-fadeIn" id="journey-finished-banner">
              <span className="text-xl">✨🌋💍✨</span>
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">La Missió s'ha completat!</h4>
              <p className="text-[10px] text-[#b09893] max-w-xs leading-relaxed font-sans">
                L'Anell Únic ha estat destruït amb èxit. El teu diari i estadístiques de viatge es conserven a sota. Per començar una nova aventura, pots reiniciar en qualsevol moment.
              </p>
            </div>
          )}

          {/* Quick-Walk Utility for easy testing & review of Milestones (Catalan) */}
          {showDevTools && (
            <div className="flex flex-col gap-1 bg-[#1a110f] p-2 rounded-xl border border-[#2d1e1c]">
              <span className="text-[9px] font-mono text-[#8c736e] font-bold px-1 uppercase tracking-wider flex items-center gap-1 select-none">
                <Sparkles className="w-3 h-3 text-[#e6c280]" />
                Portal de Caminada Ràpida (Controls de Proves)
              </span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {[
                  { label: "+10 km", val: 10, note: "Passeig ràpid pels afores" },
                  { label: "+40 km (Bree)", val: 40, note: "Viatge complet fins a Bree" },
                  { label: "+350 km (Rivendell)", val: 350, note: "Escalada d'Amon Sûl cap a Rivendell" },
                  { label: "+560 km (Mòria)", val: 560, note: "Descens fosc a Khazad-dûm" },
                  { label: "+650 km (Amon Hen)", val: 650, note: "Marxa fins a Amon Hen pel riu Anduin" },
                  { label: "+1482 km (Mont del Destí)", val: 1482, note: "Esforç extrem fins al cràter final" }
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    id={`quick-add-${idx}`}
                    onClick={() => handleAddWalk(btn.val, btn.note)}
                    className="text-[9px] font-mono text-[#e6c280] bg-[#2a1d1b] border border-[#3e2d2a] hover:bg-[#3c2a26] px-1.5 py-1 rounded transition-all cursor-pointer"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Travel Logs and Stats Sheet overlay */}
        <AnimatePresence>
          {showLogs && (
            <motion.div 
              id="travel-logs-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute inset-x-0 bottom-0 top-[15%] bg-[#1a110f] border-t border-[#df5a3e]/30 shadow-2xl rounded-t-2xl z-40 flex flex-col p-4 pt-1"
            >
              {/* Slide down pill handle indicator */}
              <div 
                onClick={() => { playClickSound(); setShowLogs(false); }}
                className="w-full flex justify-center py-2.5 cursor-pointer group shrink-0"
                id="logs-slide-down-handle"
                title="Glissa cap avall per tancar"
              >
                <div className="w-16 h-1 rounded-full bg-[#3e2c28] group-hover:bg-[#df5a3e] transition-colors" />
              </div>

              {/* Sheet Header with Navigation Tabs (Diari vs Estadístiques) */}
              <div className="flex justify-center border-b border-[#322320] pb-2.5 mb-2.5 shrink-0" id="stats-app-tabs-container">
                <div className="flex items-center gap-1 bg-[#261816] rounded-xl p-0.5 border border-[#3e2c28]">
                  <button
                    onClick={() => { playClickSound(); setActiveTab("logs"); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      activeTab === "logs" 
                        ? "bg-[#df5a3e] text-[#1b110f]" 
                        : "text-[#b09893] hover:text-white"
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    Diari de ruta ({state.logs.length})
                  </button>
                  <button
                    onClick={() => { playClickSound(); setActiveTab("stats"); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      activeTab === "stats" 
                        ? "bg-[#df5a3e] text-[#1b110f]" 
                        : "text-[#b09893] hover:text-white"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Estadístiques
                  </button>
                </div>
              </div>

              {/* Scrollable sheet body content */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 scrollbar-thin">
                
                {activeTab === "logs" ? (
                  /* --- Tab A: Travel Log Book --- */
                  state.logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <Compass className="w-10 h-10 text-[#4c3733] mb-2 animate-spin duration-10000" />
                      <p className="text-xs text-[#8c736e] font-serif italic">
                        El teu diari de viatge està buit. Comença a caminar per descriure les teves fites en el camí.
                      </p>
                    </div>
                  ) : (
                    state.logs.map((log) => (
                      <div 
                        key={log.id} 
                        className="bg-[#231715] border border-[#3e2b27] rounded-xl p-3 flex items-start justify-between gap-4 text-left hover:border-amber-900/50 transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-xs font-extrabold font-mono text-[#df5a3e]">+{log.kmsAdded} km</span>
                            
                            {/* Steps & Kcal badges inside Journal */}
                            <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 rounded-full px-2 py-0.2 flex items-center gap-0.5 font-mono">
                              <Footprints className="w-2.5 h-2.5" />
                              {log.steps?.toLocaleString() || Math.round(log.kmsAdded * 1320).toLocaleString()} passes
                            </span>
                            <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-900/30 rounded-full px-2 py-0.2 flex items-center gap-0.5 font-mono">
                              <Flame className="w-2.5 h-2.5" />
                              {log.calories || Math.round(log.kmsAdded * 60)} kcal
                            </span>

                            <span className="text-[10px] text-[#8c736e] font-mono ml-auto">{log.timestamp}</span>
                          </div>
                          <p className="text-xs text-white mt-1.5 font-serif">{log.note}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteLog(log.id, log.kmsAdded)}
                          className="text-[#8c736e] hover:text-[#df5a3e] p-1.5 rounded hover:bg-[#2d1e1b] transition-all cursor-pointer shrink-0 mt-0.5"
                          title="Eliminar registre"
                          id={`delete-log-${log.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )
                ) : (
                  /* --- Tab B: Detailed Stats (Catalan) --- */
                  <div className="grid grid-cols-2 gap-3 py-1">
                    
                    {/* Stat Card 1: Kms Total & Avg */}
                    <div className="bg-[#231715] border border-[#3e2b27] p-3.5 rounded-2xl text-left flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-[#8c736e] uppercase tracking-wider">Distància total</span>
                      <span className="text-xl font-bold font-mono text-[#e6c280]">{totalKms.toLocaleString()} km</span>
                      <div className="h-[1px] bg-orange-950/20 my-1" />
                      <span className="text-[10px] text-[#b09893] font-mono">Mitjana: {groupedStats.avgKmsGrouped} km / dia actiu</span>
                    </div>

                    {/* Stat Card 2: Steps Total & Avg */}
                    <div className="bg-[#231715] border border-[#3e2b27] p-3.5 rounded-2xl text-left flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-[#8c736e] uppercase tracking-wider flex items-center gap-1">
                        <Footprints className="w-3 h-3 text-[#df5a3e]" /> Passos totals
                      </span>
                      <span className="text-xl font-bold font-mono text-white">{totalSteps.toLocaleString()}</span>
                      <div className="h-[1px] bg-orange-950/20 my-1" />
                      <span className="text-[10px] text-[#b09893] font-mono">Mitjana: {groupedStats.avgStepsGrouped.toLocaleString()} passos</span>
                    </div>

                    {/* Stat Card 3: Calories Total & Avg */}
                    <div className="bg-[#231715] border border-[#3e2b27] p-3.5 rounded-2xl text-left flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-[#8c736e] uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" /> Energies cremades
                      </span>
                      <span className="text-xl font-bold font-mono text-amber-400">{totalKcal.toLocaleString()} kcal</span>
                      <div className="h-[1px] bg-orange-950/20 my-1" />
                      <span className="text-[10px] text-[#b09893] font-mono">Mitjana: {groupedStats.avgKcalGrouped.toLocaleString()} kcal / dia</span>
                    </div>

                    {/* Stat Card 4: Best Day Walk */}
                    <div className="bg-[#231715] border border-[#3e2b27] p-3.5 rounded-2xl text-left flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-[#8c736e] uppercase tracking-wider">Millor tirada (max)</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">{groupedStats.bestDayGrouped} km</span>
                      <div className="h-[1px] bg-orange-950/20 my-1" />
                      <span className="text-[10px] text-[#b09893] font-mono">En un sol dia actiu</span>
                    </div>

                    {/* Stat Card 5: Streaks (Current and Max consecutive days) */}
                    <div className="col-span-2 bg-[#2a1a17] border border-amber-900/30 p-4 rounded-2xl text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-mono text-[#e6c280] uppercase tracking-wider font-extrabold">Ratxa consecutiva de marxa</span>
                        <p className="text-xs text-[#b09893] mt-0.5 leading-relaxed">Caminades registrades en dies consecutius.</p>
                      </div>
                      <div className="flex gap-4 shrink-0 font-mono">
                        <div className="flex flex-col text-right">
                          <span className="text-[9px] text-[#8c736e] uppercase">Ratxa actual</span>
                          <span className="text-lg font-bold text-amber-400">{streak.current} dies 🔥</span>
                        </div>
                        <div className="w-[1px] bg-amber-900/20" />
                        <div className="flex flex-col text-right">
                          <span className="text-[9px] text-[#8c736e] uppercase">Ratxa màxima</span>
                          <span className="text-lg font-bold text-white">{streak.max} dies 🏆</span>
                        </div>
                      </div>
                    </div>

                    {/* Stat Card 6: Time elapsed & Walked days ratio */}
                    <div className="col-span-2 bg-[#221614] border border-[#3e2b27] p-4 rounded-2xl text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" id="stats-journey-timeline">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-mono text-[#e6c280] uppercase tracking-wider font-extrabold">Cronologia del Viatge</span>
                        <p className="text-xs text-[#b09893] mt-0.5 leading-relaxed">Dies transcorreguts des del primer dia d'aventura fins avui.</p>
                      </div>
                      <div className="flex gap-4 shrink-0 font-mono">
                        <div className="flex flex-col text-right">
                          <span className="text-[9px] text-[#8c736e] uppercase">Dies transcorreguts</span>
                          <span className="text-lg font-bold text-white">{getJourneyDaysCount()} dies 🗓️</span>
                        </div>
                        <div className="w-[1px] bg-amber-900/20" />
                        <div className="flex flex-col text-right">
                          <span className="text-[9px] text-[#8c736e] uppercase">Dies que has caminat</span>
                          <span className="text-lg font-bold text-[#df5a3e]">{getWalkedDaysCount()} de {getJourneyDaysCount()} ({Math.round((getWalkedDaysCount() / getJourneyDaysCount()) * 100) || 0}%) 🚶</span>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone: Reset Button inside Statistics */}
                    <div className="col-span-2 mt-6 flex flex-col items-center gap-2 border-t border-amber-950/35 pt-5 pb-2">
                      <span className="text-[9px] font-mono text-[#8c736e] uppercase tracking-wider">Zona de Gestió del Viatge</span>
                      <button 
                        onClick={handleReset}
                        className="w-full max-w-xs py-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-red-400 hover:text-red-300 font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99]"
                        id="reset-journey-btn"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reiniciar Tota l'Aventura
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Milestone Detail Popup Modal Dialog */}
        <AnimatePresence>
          {activePopup && (
            <motion.div 
              id="milestone-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
            >
              <motion.div 
                id="milestone-modal-card"
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                transition={{ type: "spring", damping: 20 }}
                className="w-full max-w-sm bg-[#221614] border border-[#e6c280] rounded-2xl overflow-hidden shadow-2xl p-5 relative text-center"
              >
                {/* Close Button top-right */}
                <button
                  onClick={() => { 
                    playClickSound(); 
                    if (playingAudio) {
                      playingAudio.pause();
                      setPlayingAudio(null);
                      setIsAudioPlaying(false);
                    }
                    setActivePopup(null); 
                  }}
                  className="absolute top-3 right-3 text-[#8c736e] hover:text-white p-1 rounded-full bg-black/20 hover:bg-black/40 cursor-pointer"
                  id="close-milestone-popup"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Ring Banner */}
                <span className="text-[9px] font-mono text-[#e6c280] font-bold tracking-[2px] uppercase">
                  ✨ FITA DESBLOQUEJADA ✨
                </span>

                <h3 className="font-serif font-extrabold text-lg text-white mt-2 leading-tight">
                  {activePopup.name}
                </h3>
                
                <span className="inline-block text-[10px] font-bold font-mono text-[#df5a3e] bg-[#df5a3e]/10 border border-[#df5a3e]/30 px-2 py-0.5 rounded-full mt-1">
                  recorreguts {activePopup.distance} km
                </span>

                {/* specialized Book text quote block */}
                <div className="bg-[#170e0d] border border-amber-950/20 rounded-xl p-3.5 text-left mt-4 relative">
                  <span className="absolute -top-3 left-4 bg-[#221614] px-2 text-[8px] font-mono font-bold text-[#8c736e]">
                    Cròniques de Tolkien
                  </span>
                  <p className="text-xs text-[#d4c3c0] italic font-serif leading-relaxed text-center">
                    "{activePopup.bookText}"
                  </p>
                  <p className="text-[9px] font-bold text-right text-[#8c736e] font-sans mt-2">
                    — J.R.R. Tolkien, El Senyor dels Anells
                  </p>
                </div>

                {/* Milestone Image instead of Diari de Campanya */}
                {activePopup.image && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-[#3e2c28] aspect-video relative group shadow-md">
                    <img 
                      src={activePopup.image} 
                      alt={activePopup.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                      <p className="text-[11px] text-white text-left font-sans font-medium drop-shadow-md leading-relaxed">
                        {activePopup.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Custom Audio Play Button */}
                <div className="mt-6 flex flex-col gap-2">
                  {activePopup.audio && (
                    <button
                      onClick={() => handlePlayCustomAudio(activePopup)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                        isAudioPlaying 
                          ? "bg-amber-500 text-[#1b110f] animate-pulse" 
                          : "bg-[#df5a3e] hover:bg-[#ff7b5a] text-[#1b110f]"
                      }`}
                      id="trigger-custom-audio-btn"
                    >
                      {isAudioPlaying ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          Aturar l'àudio
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          Escolta la crònica
                        </>
                      )}
                    </button>
                  )}

                  {/* Pulsing sound waves indicator while audio is playing */}
                  {isAudioPlaying && (
                    <div className="flex justify-center items-center gap-1 py-1" id="sound-waves">
                      {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                        <motion.div 
                          key={i}
                          className="w-0.5 bg-amber-500 rounded-full"
                          animate={{ height: [4, h * 4, 4] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.08 }}
                        />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => { 
                      playClickSound(); 
                      if (playingAudio) {
                        playingAudio.pause();
                        setPlayingAudio(null);
                        setIsAudioPlaying(false);
                      }
                      setActivePopup(null); 
                    }}
                    className="w-full py-2 bg-transparent text-[#b09893] hover:text-white border border-[#3e2c28] rounded-xl text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer"
                    id="close-milestone-dialog-btn"
                  >
                    Tancar i continuar caminant
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Confirmation Dialog Modal */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div 
              id="reset-confirm-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
            >
              <motion.div 
                id="reset-confirm-card"
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                transition={{ type: "spring", damping: 20 }}
                className="w-full max-w-xs bg-[#221614] border border-[#e6c280] rounded-2xl overflow-hidden shadow-2xl p-5 relative text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-xl">
                    ⚠️
                  </div>
                  
                  <h3 className="font-serif font-black text-lg text-white leading-tight">
                    Reiniciar el viatge?
                  </h3>
                  
                  <p className="text-xs text-[#b09893] leading-relaxed">
                    Estàs segur que vols reiniciar el teu progrés de fitnes? Es borraran de manera permanent totes les caminades del diari de ruta i tornaràs a començar des de la Comarca.
                  </p>

                  <div className="flex flex-col gap-2 w-full mt-4">
                    <button
                      onClick={confirmReset}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                      id="confirm-reset-btn"
                    >
                      Sí, reiniciar progrés
                    </button>
                    
                    <button
                      onClick={() => { playClickSound(); setShowResetConfirm(false); }}
                      className="w-full py-2 bg-transparent text-[#b09893] hover:text-white border border-[#3e2c28] rounded-xl text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer"
                      id="cancel-reset-btn"
                    >
                      Cancel·lar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Walk Dialog Modal (Contextual Menu from Floating + Bubble) */}
        <AnimatePresence>
          {showAddWalkModal && (
            <motion.div 
              id="add-walk-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
            >
              <motion.div 
                id="add-walk-card"
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                transition={{ type: "spring", damping: 20 }}
                className="w-full max-w-sm bg-[#221614] border border-[#e6c280] rounded-2xl overflow-hidden shadow-2xl p-5 relative"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-[#3e2b27] pb-3">
                    <div className="w-8 h-8 rounded-full bg-[#df5a3e]/10 border border-[#df5a3e]/30 flex items-center justify-center text-[#df5a3e]">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-serif font-black text-base text-white leading-none">
                        Registrar caminada real
                      </h3>
                      <p className="text-[10px] text-[#8c736e] font-mono mt-1 uppercase">Afegeix les teves dades diàries</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {/* Dropdown for Kilometers (0 to 20) */}
                    <div className="flex-1 flex flex-col gap-1 text-left">
                      <label className="text-[10px] text-[#8c736e] font-mono uppercase pl-1">Quilòmetres (km)</label>
                      <div className="relative">
                        <select
                          value={selectedKm}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setSelectedKm(val);
                            if (val === 20) {
                              setSelectedMeters(0);
                            }
                          }}
                          className="w-full text-xs font-mono bg-[#160d0b] border border-[#3e2b27] rounded-xl pl-3 pr-8 py-3 text-white outline-none appearance-none focus:border-[#e6c280] focus:ring-1 focus:ring-[#e6c280] transition-all cursor-pointer hover:bg-[#211513] shadow-inner"
                          id="km-dropdown"
                        >
                          {Array.from({ length: 21 }, (_, i) => i).map((km) => (
                            <option key={km} value={km} className="bg-[#1b110f] text-white">
                              {km} km
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#df5a3e]">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Dropdown for Meters (0 to 900, steps of 100) */}
                    <div className="flex-1 flex flex-col gap-1 text-left">
                      <label className="text-[10px] text-[#8c736e] font-mono uppercase pl-1">Metres (m)</label>
                      <div className="relative">
                        <select
                          value={selectedMeters}
                          onChange={(e) => {
                            setSelectedMeters(parseInt(e.target.value, 10));
                          }}
                          disabled={selectedKm === 20}
                          className={`w-full text-xs font-mono bg-[#160d0b] border border-[#3e2b27] rounded-xl pl-3 pr-8 py-3 text-white outline-none appearance-none focus:border-[#e6c280] focus:ring-1 focus:ring-[#e6c280] transition-all cursor-pointer hover:bg-[#211513] shadow-inner ${selectedKm === 20 ? "opacity-55 cursor-not-allowed" : ""}`}
                          id="meters-dropdown"
                        >
                          {Array.from({ length: 10 }, (_, i) => i * 100).map((m) => (
                            <option key={m} value={m} className="bg-[#1b110f] text-white">
                              {m} m
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#df5a3e]">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-[#8c736e] font-mono uppercase pl-1">Nota personal (opcional)</label>
                    <input 
                      type="text"
                      placeholder="Ex: 'He creuat el riu camí a Bree'"
                      value={noteVal}
                      onChange={(e) => setNoteVal(e.target.value)}
                      className="w-full text-xs bg-[#160d0b] border border-[#3e2b27] rounded-xl px-3 py-3 text-white placeholder-[#5c4743] outline-none focus:border-[#e6c280] transition-all"
                      id="note-input-field"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full mt-2">
                    <button
                      onClick={handleLogDropdownWalk}
                      disabled={selectedKm === 0 && selectedMeters === 0}
                      className={`w-full py-3 bg-[#df5a3e] hover:bg-[#ff7b5a] text-[#1b110f] font-black rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ${
                        selectedKm === 0 && selectedMeters === 0 ? "opacity-50 cursor-not-allowed bg-neutral-700 text-neutral-400" : "cursor-pointer active:scale-95"
                      }`}
                      id="submit-walk-btn"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      Registrar Caminada
                    </button>
                    
                    <button
                      onClick={() => { playClickSound(); setShowAddWalkModal(false); }}
                      className="w-full py-2.5 bg-transparent text-[#b09893] hover:text-white border border-[#3e2c28] rounded-xl text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer text-center"
                      id="cancel-walk-btn"
                    >
                      Cancel·lar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Daily Limit Error Dialog Modal */}
        <AnimatePresence>
          {dailyLimitError && (
            <motion.div 
              id="daily-limit-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 flex items-center justify-center p-4 z-50 overflow-y-auto"
            >
              <motion.div 
                id="daily-limit-card"
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                transition={{ type: "spring", damping: 20 }}
                className="w-full max-w-sm bg-[#221614] border-2 border-[#df5a3e] rounded-2xl overflow-hidden shadow-2xl p-6 relative text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#df5a3e]/10 border border-[#df5a3e]/30 flex items-center justify-center text-3xl animate-pulse">
                    🪵🥾
                  </div>
                  
                  <h3 className="font-serif font-black text-lg text-[#e6c280] leading-tight uppercase tracking-wide">
                    Límit de resistència assolit!
                  </h3>
                  
                  <p className="text-xs text-[#d4c3c0] font-sans leading-relaxed">
                    {dailyLimitError}
                  </p>

                  <div className="bg-[#170e0d] p-3 rounded-xl border border-orange-950/40 text-[11px] text-[#b09893] italic font-serif leading-relaxed text-center w-full mt-1">
                    "Fins i tot els Hòbits més forts necessiten descansar després d'una gran jornada. No us sobrepasseu, companys de viatge!"
                  </div>

                  <div className="flex flex-col gap-2 w-full mt-2">
                    <button
                      onClick={() => { playClickSound(); setDailyLimitError(null); }}
                      className="w-full py-3 bg-[#df5a3e] hover:bg-[#ff7b5a] text-[#1b110f] rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
                      id="close-limit-error-btn"
                    >
                      D'acord, descansaré
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
          </>
        )}

      </div>
    </div>
  );
}
