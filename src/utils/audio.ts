// Procedural Audio Synthesizer and TTS engine

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

// Play a single note
function playNote(freq: number, type: OscillatorType, duration: number, startTime: number, volume = 0.1) {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser security)
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// 1. Play Hobbit-like peaceful chime (Shire/Rivendell)
export function playPeacefulChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Play E5, G#5, B5, E6 (E major chord, sweet and pure)
    playNote(659.25, "sine", 0.6, now, 0.12);
    playNote(830.61, "sine", 0.6, now + 0.15, 0.12);
    playNote(987.77, "sine", 0.6, now + 0.30, 0.12);
    playNote(1318.51, "sine", 0.8, now + 0.45, 0.10);
  } catch (e) {
    console.warn("Audio Context playback failed", e);
  }
}

// 2. Play dark brooding chime (Moria, Mordor, Ring)
export function playDarkChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Play low dissonant notes (C3, Eb3, F#3)
    playNote(130.81, "sawtooth", 1.0, now, 0.08);
    playNote(155.56, "sawtooth", 1.0, now + 0.2, 0.08);
    playNote(185.00, "triangle", 1.2, now + 0.4, 0.12);
  } catch (e) {
    console.warn("Audio Context playback failed", e);
  }
}

// 3. Play victory chime (Mount Doom)
export function playVictoryChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Ascending arpeggio with high energy
    playNote(261.63, "triangle", 0.4, now, 0.15); // C4
    playNote(329.63, "triangle", 0.4, now + 0.1, 0.15); // E4
    playNote(392.00, "triangle", 0.4, now + 0.2, 0.15); // G4
    playNote(523.25, "sine", 0.4, now + 0.3, 0.15); // C5
    playNote(659.25, "sine", 0.4, now + 0.4, 0.15); // E5
    playNote(783.99, "sine", 0.5, now + 0.5, 0.15); // G5
    playNote(1046.50, "sine", 1.0, now + 0.6, 0.15); // C6
  } catch (e) {
    console.warn("Audio Context playback failed", e);
  }
}

// 4. Play button click chime
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    playNote(880, "sine", 0.1, ctx.currentTime, 0.05);
  } catch (e) {}
}

// 5. Play stepping footstep sound (procedural grass/dirt step)
export function playStepSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // A low-frequency thud representing the foot weight
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.1);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.04, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);

    // A high-frequency friction sweep representing the ground rustle
    const brushOsc = ctx.createOscillator();
    const brushGain = ctx.createGain();
    brushOsc.type = "sine";
    brushOsc.frequency.setValueAtTime(1100, now);
    brushOsc.frequency.linearRampToValueAtTime(550, now + 0.07);

    brushGain.gain.setValueAtTime(0, now);
    brushGain.gain.linearRampToValueAtTime(0.012, now + 0.005);
    brushGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    brushOsc.connect(brushGain);
    brushGain.connect(ctx.destination);
    brushOsc.start(now);
    brushOsc.stop(now + 0.07);
  } catch (e) {
    console.warn("Step audio error", e);
  }
}

// Speech Synthesis is removed as requested.
// Below is a helper function to play any custom audio URL.
// You can supply any URL to an MP3, WAV, etc.
export function playCustomAudio(audioUrl: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(audioUrl);
      audio.volume = 0.5; // You can change the volume here (0.0 to 1.0)
      audio.play()
        .then(() => resolve(audio))
        .catch(err => {
          console.warn("Could not play custom audio. This is normal if there hasn't been a user interaction yet.", err);
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
}
