// Programmatic sound effects synthesizer using the Web Audio API
// Ensures 100% offline functionality with zero external audio assets

let audioCtx = null;
let muted = false;

// Initialize mute state from localStorage
try {
  muted = localStorage.getItem("sound_muted") === "true";
} catch (e) {}

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  try {
    localStorage.setItem("sound_muted", muted ? "true" : "false");
  } catch (e) {}
  if (muted) {
    stopPackOpeningLoop();
  }
  return muted;
}

function initAudio() {
  if (muted) return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Synthesize a professional double referee whistle blast
export function playWhistle() {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const playBlast = (startTime, duration) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(1050, startTime);
      osc2.frequency.setValueAtTime(1070, startTime); // slightly detuned

      osc1.frequency.linearRampToValueAtTime(1080, startTime + duration);
      osc2.frequency.linearRampToValueAtTime(1100, startTime + duration);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.35, startTime + 0.05); 
      gainNode.gain.setValueAtTime(0.35, startTime + duration - 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); 

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);

      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
    };

    playBlast(now, 0.15);
    playBlast(now + 0.22, 0.45);
  } catch (error) {
    console.warn("Failed to play whistle:", error);
  }
}

// 2. Synthesize massive stadium crowd cheering roar WITH RHYTHMIC low-pass "GOAT! GOAT!" CHANTS
export function playCrowdGoal() {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 6.0;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(1.5, now);
    filter.frequency.setValueAtTime(260, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.45); 
    filter.frequency.exponentialRampToValueAtTime(320, now + duration);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.85, now + 0.35); 
    gainNode.gain.exponentialRampToValueAtTime(0.4, now + 1.5); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); 

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseSource.start(now);
    noiseSource.stop(now + duration);

    const chantTimes = [0.4, 1.2, 2.0, 2.8, 3.6]; 
    chantTimes.forEach((time) => {
      const chantGain = ctx.createGain();
      const oscs = [];
      const frequencies = [140, 160, 200, 240, 270, 310]; 
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        const detuneAmt = (idx - 2.5) * 5; 
        osc.frequency.setValueAtTime(freq + detuneAmt, now + time);
        osc.frequency.linearRampToValueAtTime(freq + detuneAmt - 40, now + time + 0.45);
        osc.connect(chantGain);
        oscs.push(osc);
      });

      const chantFilter = ctx.createBiquadFilter();
      chantFilter.type = "lowpass";
      chantFilter.frequency.setValueAtTime(520, now + time);

      chantGain.gain.setValueAtTime(0, now + time);
      chantGain.gain.linearRampToValueAtTime(0.7, now + time + 0.06); 
      chantGain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.45); 

      chantGain.connect(chantFilter);
      chantFilter.connect(ctx.destination);

      oscs.forEach((osc) => {
        osc.start(now + time);
        osc.stop(now + time + 0.5);
      });
    });
  } catch (error) {
    console.warn("Failed to play crowd goal:", error);
  }
}

// 3. Synthesize a massive sub-bass BOOM, pyrotechnic crackles, and stadium air horns
export function playExplosionSound() {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(10, now + 1.8);
    
    subGain.gain.setValueAtTime(0.95, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.8);

    const bufferSize = ctx.sampleRate * 2.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(50, now + 1.4);
    noiseFilter.Q.setValueAtTime(8.5, now); 

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.9, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 2.2);

    const playAirHorn = (time, duration) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const hornGain = ctx.createGain();
      const bandpass = ctx.createBiquadFilter();

      osc1.type = "sawtooth";
      osc2.type = "sawtooth";

      osc1.frequency.setValueAtTime(440, now + time);
      osc2.frequency.setValueAtTime(443, now + time);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 17; 
      lfoGain.gain.value = 9;   

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(580, now + time);
      bandpass.Q.setValueAtTime(1.2, now + time);

      hornGain.gain.setValueAtTime(0, now + time);
      hornGain.gain.linearRampToValueAtTime(0.35, now + time + 0.02); 
      hornGain.gain.setValueAtTime(0.35, now + time + duration - 0.04);
      hornGain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);

      osc1.connect(hornGain);
      osc2.connect(hornGain);
      hornGain.connect(bandpass);
      bandpass.connect(ctx.destination);

      lfo.start(now + time);
      osc1.start(now + time);
      osc2.start(now + time);

      lfo.stop(now + time + duration);
      osc1.stop(now + time + duration);
      osc2.stop(now + time + duration);
    };

    playAirHorn(0.12, 0.16); 
    playAirHorn(0.34, 0.16); 
    playAirHorn(0.56, 0.85); 
    
  } catch (error) {
    console.warn("Failed to play explosion sound:", error);
  }
}

// 4. Synthesize a chest-thumping powerful boot-to-ball kick impact (Thud + Woosh)
export function playKickSound() {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.16);
    
    gainNode.gain.setValueAtTime(0.9, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);

    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(140, now);
    filter.Q.setValueAtTime(2.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    noise.start(now);
    noise.stop(now + 0.08);
  } catch (error) {
    console.warn("Failed to play kick sound:", error);
  }
}

// 5. Synthesize a time-dilation slow motion resonant whoosh drone
export function playSlowMoSound() {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.linearRampToValueAtTime(45, now + 0.75); 

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(750, now);
    filter.frequency.exponentialRampToValueAtTime(65, now + 0.75); 
    filter.Q.setValueAtTime(4.5, now); 

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.25); 
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75); 

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.75);
  } catch (error) {
    console.warn("Failed to play slowmo sound:", error);
  }
}

// 6. Synthesize high-frequency electric lightning discharge bolts (Zap + Crackle + Rumble)
export function playLightningZap() {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const playCrackle = (time, duration, volume) => {
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(3200, now + time);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume, now + time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + time + duration);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      noise.start(now + time);
      noise.stop(now + time + duration);
    };

    playCrackle(0.0, 0.16, 0.5);
    playCrackle(0.08, 0.08, 0.4);
    playCrackle(0.18, 0.28, 0.6);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(62, now);
    osc.frequency.linearRampToValueAtTime(105, now + 0.4); 

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(420, now);
    filter.Q.setValueAtTime(2.8, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.4);
  } catch (error) {
    console.warn("Failed to play lightning zap:", error);
  }
}

// 7. Looping pack-opening background crowd ambient roar & pedestal sub-bass hum
let activePackLoop = null;

export function startPackOpeningLoop() {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    stopPackOpeningLoop();

    const bufferSize = ctx.sampleRate * 2.5; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.Q.setValueAtTime(1.1, now);
    noiseFilter.frequency.setValueAtTime(340, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.38, now + 1.2); 

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);

    const humOsc = ctx.createOscillator();
    const humGain = ctx.createGain();
    humOsc.type = "triangle";
    humOsc.frequency.setValueAtTime(49, now); 

    humGain.gain.setValueAtTime(0, now);
    humGain.gain.linearRampToValueAtTime(0.4, now + 1.2);

    humOsc.connect(humGain);
    humGain.connect(ctx.destination);
    humOsc.start(now);

    activePackLoop = {
      noiseSource,
      humOsc,
      noiseGain,
      humGain,
      ctx,
      stop: () => {
        const stopNow = ctx.currentTime;
        noiseGain.gain.setValueAtTime(noiseGain.gain.value, stopNow);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, stopNow + 0.6);
        
        humGain.gain.setValueAtTime(humGain.gain.value, stopNow);
        humGain.gain.exponentialRampToValueAtTime(0.001, stopNow + 0.6);

        setTimeout(() => {
          try {
            noiseSource.stop();
            humOsc.stop();
          } catch (e) {}
        }, 700);
      }
    };
  } catch (error) {
    console.warn("Failed to start pack opening loop:", error);
  }
}

export function stopPackOpeningLoop() {
  if (activePackLoop) {
    activePackLoop.stop();
    activePackLoop = null;
  }
}

// 8. Synthesize massive transition fanfare celebration (Confetti Chime + Whistle + Applause Swell)
export function playTransitionCelebration() {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const playBlast = (startTime, duration, pitch) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, startTime);
      osc.frequency.linearRampToValueAtTime(pitch + 40, startTime + duration);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.03);
      gain.gain.setValueAtTime(0.3, startTime + duration - 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    playBlast(now, 0.12, 980);
    playBlast(now + 0.16, 0.12, 980);
    playBlast(now + 0.32, 0.38, 1010);

    const playChime = (startTime, freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.45);
    };

    playChime(now + 0.08, 523.25); // C5
    playChime(now + 0.20, 659.25); // E5
    playChime(now + 0.32, 783.99); // G5
    playChime(now + 0.44, 1046.50); // C6

    const bufferSize = ctx.sampleRate * 2.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(1.0, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.68, now + 0.25); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 2.5);

  } catch (error) {
    console.warn("Failed to play transition celebration:", error);
  }
}

// 9. Synthesize futuristic high-pitch UI beep
export function playBeepSound() {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    console.warn(e);
  }
}

// 10. Synthesize a subtle whoosh/hover sweep
export function playHoverSound() {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch (e) {}
}

// 11. Synthesize heavy sub-bass kick count beat
export function playBassKick() {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.25);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {}
}

// 12. Countdown Sound (Beep chime + Bass impact)
export function playCountdownSound(num) {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Bass thud
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(80, now);
    subOsc.frequency.linearRampToValueAtTime(20, now + 0.3);
    subGain.gain.setValueAtTime(0.7, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.3);

    // High warning chime
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = "sine";
    chime.frequency.setValueAtTime(num === 1 ? 1600 : 880, now);
    chimeGain.gain.setValueAtTime(0.2, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(now);
    chime.stop(now + 0.25);

  } catch (e) {}
}
