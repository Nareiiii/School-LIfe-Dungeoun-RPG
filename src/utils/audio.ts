/**
 * Synthesizer audio engine using Web Audio API
 * Provides procedural RPG background music (BGM) and interactive sound effects (SFX).
 * Zero external CDN dependencies, instant low-latency audio.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmGainNode: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: ReturnType<typeof setInterval> | null = null;
  private bgmStep: number = 0;
  private bgmVolume: number = 0.3; // Default 30% volume

  constructor() {
    if (typeof window !== 'undefined') {
      this.isMuted = localStorage.getItem('study_rpg_muted') === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGainNode = this.ctx.createGain();
        this.bgmGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
        this.bgmGainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Toggle global audio mute state
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('study_rpg_muted', String(this.isMuted));
    }

    if (this.ctx && this.bgmGainNode) {
      const targetGain = this.isMuted ? 0 : this.bgmVolume;
      this.bgmGainNode.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }

    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private currentBgmType: 'lobby' | 'battle' | null = null;

  // ========================================================
  // DUAL AUDIO SOUNDTRACK (BGM): LOBBY VS ARENA
  // 1. Lobby: Calm Lo-Fi / Acoustic Orchestral Focus Progression
  // 2. Arena: Uptempo Synthwave / Battle Raid Focus Pulse
  // ========================================================

  /**
   * Start the Calm Lo-Fi / Acoustic Orchestral BGM for Lobby (Role Selection)
   */
  public startLobbyBGM() {
    this.initCtx();
    if (!this.ctx) return;

    // If already playing lobby BGM, no need to restart
    if (this.isBgmPlaying && this.currentBgmType === 'lobby') return;

    this.stopBGM();
    this.isBgmPlaying = true;
    this.currentBgmType = 'lobby';
    this.bgmStep = 0;

    // Soothing Lofi / Acoustic chords in C Major / A Minor
    // Progression: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4 (calm, warm, reflective)
    const lobbyBass = [
      65.41, 65.41, 65.41, 65.41, // C2
      55.0,  55.0,  55.0,  55.0,  // A1
      43.65, 43.65, 43.65, 43.65, // F1
      49.0,  49.0,  49.0,  49.0,  // G1
    ];

    const lobbyChords = [
      [261.63, 329.63, 392.0, 493.88], // C4, E4, G4, B4 (Cmaj7)
      [220.0,  261.63, 329.63, 493.88], // A3, C4, E4, B4 (Am9)
      [174.61, 220.0,  261.63, 329.63], // F3, A3, C4, E4 (Fmaj7)
      [196.0,  261.63, 293.66, 392.0],  // G3, C4, D4, G4 (Gsus4)
    ];

    const lobbyMelody = [
      523.25, 493.88, 392.0, 329.63, // C5, B4, G4, E4
      440.0,  392.0,  329.63, 261.63, // A4, G4, E4, C4
      349.23, 440.0,  523.25, 659.25, // F4, A4, C5, E5
      587.33, 493.88, 392.0, 293.66, // D5, B4, G4, D4
    ];

    // Relaxed tempo: 360ms interval (~83 BPM lofi study groove)
    this.bgmIntervalId = setInterval(() => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGainNode || this.currentBgmType !== 'lobby') return;
      if (this.isMuted) return;

      const now = this.ctx.currentTime;
      const stepIdx = this.bgmStep % 16;
      const chordIdx = Math.floor(stepIdx / 4);

      // Warm acoustic bass note (triangle wave with smooth envelope)
      const bassFreq = lobbyBass[stepIdx];
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);
      bassGain.gain.setValueAtTime(0.14, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
      bassOsc.connect(bassGain);
      bassGain.connect(this.bgmGainNode);
      bassOsc.start(now);
      bassOsc.stop(now + 0.35);

      // Delicate harp / Rhodes chime
      const melFreq = lobbyMelody[stepIdx];
      const melOsc = this.ctx.createOscillator();
      const melGain = this.ctx.createGain();
      melOsc.type = 'sine';
      melOsc.frequency.setValueAtTime(melFreq, now);
      melGain.gain.setValueAtTime(0.09, now);
      melGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      melOsc.connect(melGain);
      melGain.connect(this.bgmGainNode);
      melOsc.start(now);
      melOsc.stop(now + 0.48);

      // Pad chord warmth on beat 0 of each bar
      if (stepIdx % 4 === 0) {
        const chordNotes = lobbyChords[chordIdx];
        chordNotes.forEach((freq) => {
          const padOsc = this.ctx!.createOscillator();
          const padGain = this.ctx!.createGain();
          padOsc.type = 'sine';
          padOsc.frequency.setValueAtTime(freq, now);
          padGain.gain.setValueAtTime(0.035, now);
          padGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
          padOsc.connect(padGain);
          padGain.connect(this.bgmGainNode!);
          padOsc.start(now);
          padOsc.stop(now + 1.35);
        });
      }

      this.bgmStep++;
    }, 360);
  }

  /**
   * Start the Energetic Synthwave / Dungeon Raid BGM for Arena
   */
  public startBattleBGM() {
    this.initCtx();
    if (!this.ctx) return;

    // If already playing battle BGM, no need to restart
    if (this.isBgmPlaying && this.currentBgmType === 'battle') return;

    this.stopBGM();
    this.isBgmPlaying = true;
    this.currentBgmType = 'battle';
    this.bgmStep = 0;

    // D-minor / Dorian uptempo synthwave progression & battle drive
    // Chords: Dm -> Bb -> F -> C
    const bassNotes = [
      73.42, 73.42, 73.42, 73.42, // D2
      58.27, 58.27, 58.27, 58.27, // Bb1
      87.31, 87.31, 87.31, 87.31, // F2
      65.41, 65.41, 65.41, 65.41, // C2
    ];

    const melodyNotes = [
      293.66, 349.23, 440.0, 523.25, // D4, F4, A4, C5
      349.23, 440.0, 523.25, 587.33, // F4, A4, C5, D5
      261.63, 329.63, 392.0, 523.25, // C4, E4, G4, C5
      220.0, 261.63, 329.63, 440.0,  // A3, C4, E4, A4
    ];

    // Uptempo driving pulse: 230ms (~130 BPM energetic focus rhythm)
    this.bgmIntervalId = setInterval(() => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGainNode || this.currentBgmType !== 'battle') return;
      if (this.isMuted) return;

      const now = this.ctx.currentTime;
      const stepIdx = this.bgmStep % 16;

      // 1. Driving Bass Pulse (punchy sawtooth-filtered or triangle)
      const bassFreq = bassNotes[stepIdx];
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();

      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(0.12, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      bassOsc.connect(bassGain);
      bassGain.connect(this.bgmGainNode);

      bassOsc.start(now);
      bassOsc.stop(now + 0.22);

      // 2. High-energy Synth Arpeggio
      const melFreq = melodyNotes[stepIdx];
      const melOsc = this.ctx.createOscillator();
      const melGain = this.ctx.createGain();

      melOsc.type = 'sine';
      melOsc.frequency.setValueAtTime(melFreq, now);

      melGain.gain.setValueAtTime(0.13, now);
      melGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      melOsc.connect(melGain);
      melGain.connect(this.bgmGainNode);

      melOsc.start(now);
      melOsc.stop(now + 0.35);

      this.bgmStep++;
    }, 230);
  }

  /**
   * Generic startBGM helper for backwards compatibility
   */
  public startBGM(type: 'lobby' | 'battle' = 'battle') {
    if (type === 'lobby') {
      this.startLobbyBGM();
    } else {
      this.startBattleBGM();
    }
  }

  /**
   * Stop or pause any running BGM
   */
  public stopBGM() {
    this.isBgmPlaying = false;
    this.currentBgmType = null;
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public isPlayingBGM(): boolean {
    return this.isBgmPlaying;
  }

  public getCurrentBgmType(): 'lobby' | 'battle' | null {
    return this.currentBgmType;
  }

  // ========================================================
  // SOUND EFFECTS (SFX)
  // ========================================================

  /**
   * SFX: Knight - Shield Deflect / Shield Wall fortification
   * Resonant metallic iron clank & protective shimmer
   */
  public playShieldDeflect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Metallic high strike
    const strikeOsc = this.ctx.createOscillator();
    const strikeGain = this.ctx.createGain();
    strikeOsc.type = 'square';
    strikeOsc.frequency.setValueAtTime(580, now);
    strikeOsc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
    strikeGain.gain.setValueAtTime(0.28, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    strikeOsc.connect(strikeGain);
    strikeGain.connect(this.ctx.destination);
    strikeOsc.start(now);
    strikeOsc.stop(now + 0.16);

    // Warm protective brass ring
    [220, 330, 440, 550].forEach((freq, idx) => {
      const ringOsc = this.ctx!.createOscillator();
      const ringGain = this.ctx!.createGain();
      ringOsc.type = 'sine';
      ringOsc.frequency.setValueAtTime(freq, now + idx * 0.03);
      ringGain.gain.setValueAtTime(0.2, now + idx * 0.03);
      ringGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.45);
      ringOsc.connect(ringGain);
      ringGain.connect(this.ctx!.destination);
      ringOsc.start(now + idx * 0.03);
      ringOsc.stop(now + idx * 0.03 + 0.5);
    });
  }

  public playShieldWall() {
    this.playShieldDeflect();
  }

  /**
   * SFX: Mage - Metacognitive Checkpoint Magic Spell Chime
   * Sparkling mystical ascending chords
   */
  public playMagicSpell() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Mystical sparkling glissando
    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);
      osc.frequency.exponentialRampToValueAtTime(f * 1.15, now + idx * 0.06 + 0.25);
      gain.gain.setValueAtTime(0.22, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.38);
    });
  }

  /**
   * SFX: Healer - Motivation Chime & HP Healing Sparkle
   * Angelic warm harmonic restoration
   */
  public playHeal() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major 9th chime
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0.2, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.4);
    });
  }

  /**
   * SFX: Ranger - Whistling Arrow Shot & Target Precision Hit
   */
  public playArrowShot() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Whistling string release
    const whistle = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();

    whistle.type = 'sawtooth';
    whistle.frequency.setValueAtTime(900, now);
    whistle.frequency.exponentialRampToValueAtTime(1700, now + 0.1);
    whistle.frequency.exponentialRampToValueAtTime(320, now + 0.24);

    whistleGain.gain.setValueAtTime(0.25, now);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    whistle.connect(whistleGain);
    whistleGain.connect(this.ctx.destination);

    whistle.start(now);
    whistle.stop(now + 0.26);

    // Target thud impact
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(220, now + 0.18);
    thud.frequency.exponentialRampToValueAtTime(60, now + 0.35);
    thudGain.gain.setValueAtTime(0.3, now + 0.18);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    thud.connect(thudGain);
    thudGain.connect(this.ctx.destination);
    thud.start(now + 0.18);
    thud.stop(now + 0.4);
  }

  /**
   * SFX: Warning Alert Siren (Emergency Distraction Klaxon)
   * Loud alternating two-tone alarm for violations
   */
  public playWarningAlert() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Two-tone urgent siren pulse (880Hz -> 587Hz -> 880Hz -> 587Hz)
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(587, now + 0.1);
    osc.frequency.setValueAtTime(880, now + 0.2);
    osc.frequency.setValueAtTime(587, now + 0.3);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.48);
  }

  /**
   * SFX: Monster Boss Attack (Combined Dragon Roar + Warning Alert Siren)
   * Plays when a violation is triggered, accompanied by boss attack animation
   */
  public playMonsterAttack() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Guttural Demon Dragon Roar / Dark Energy Blast
    const roarOsc = this.ctx.createOscillator();
    const roarGain = this.ctx.createGain();
    roarOsc.type = 'sawtooth';
    roarOsc.frequency.setValueAtTime(220, now);
    roarOsc.frequency.exponentialRampToValueAtTime(55, now + 0.45);

    roarGain.gain.setValueAtTime(0.4, now);
    roarGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    roarOsc.connect(roarGain);
    roarGain.connect(this.ctx.destination);
    roarOsc.start(now);
    roarOsc.stop(now + 0.52);

    // 2. Urgent Two-Tone Warning Siren (Emergency Klaxon)
    const sirenOsc = this.ctx.createOscillator();
    const sirenGain = this.ctx.createGain();
    sirenOsc.type = 'square';
    sirenOsc.frequency.setValueAtTime(920, now + 0.08);
    sirenOsc.frequency.setValueAtTime(640, now + 0.2);
    sirenOsc.frequency.setValueAtTime(920, now + 0.32);
    sirenOsc.frequency.setValueAtTime(640, now + 0.44);

    sirenGain.gain.setValueAtTime(0.3, now + 0.08);
    sirenGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    sirenOsc.connect(sirenGain);
    sirenGain.connect(this.ctx.destination);
    sirenOsc.start(now + 0.08);
    sirenOsc.stop(now + 0.58);
  }

  public playShieldDamage() {
    this.playMonsterAttack();
  }

  /**
   * SFX: Metacognitive Explosion & Critical Boss Strike
   * Heavy bass rumble + resonant arcane explosion
   */
  public playExplosion() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Low rumble boom
    const boom = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boom.type = 'sawtooth';
    boom.frequency.setValueAtTime(140, now);
    boom.frequency.exponentialRampToValueAtTime(30, now + 0.5);
    boomGain.gain.setValueAtTime(0.45, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    boom.connect(boomGain);
    boomGain.connect(this.ctx.destination);
    boom.start(now);
    boom.stop(now + 0.58);

    // Critical impact chord
    [520, 780, 1040].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.35);
      gain.gain.setValueAtTime(0.25, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + 0.45);
    });
  }

  public playCrit() {
    this.playExplosion();
  }

  /**
   * SFX: Physical strike
   */
  public playHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * SFX: Victory fanfare
   */
  public playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.5, d: 0.45 },
    ];
    let time = this.ctx.currentTime;

    notes.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, time);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + n.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(time);
      osc.stop(time + n.d + 0.05);

      time += n.d;
    });
  }

  /**
   * SFX: Teacher Appreciation (+500 EXP Blessing Fanfare)
   * Grand triumphant ascending harp fanfare & celestial sparkles
   */
  public playTeacherAppreciation() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [392.0, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // G4 to G6
    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.24, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });

    // Golden chime sparkle overlay
    [1046.5, 1567.98, 2093.0].forEach((freq, idx) => {
      const chime = this.ctx!.createOscillator();
      const chimeGain = this.ctx!.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(freq, now + 0.3 + idx * 0.05);
      chimeGain.gain.setValueAtTime(0.15, now + 0.3 + idx * 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + idx * 0.05 + 0.6);
      chime.connect(chimeGain);
      chimeGain.connect(this.ctx!.destination);
      chime.start(now + 0.3 + idx * 0.05);
      chime.stop(now + 0.3 + idx * 0.05 + 0.65);
    });
  }

  /**
   * SFX: UI Click
   */
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const sound = new SoundEngine();
