// Web Audio API procedural sound engine
class AudioEngineClass {
  constructor() {
    this.audioCtx = null;
    this.bgmAudio = null;
    this.bgmLoaded = false;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(freq, type, duration, volume = 0.1) {
    if (!this.audioCtx) return;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  // Procedural SFX
  sfx = {
    success: () => {
      this.playTone(880, 'sine', 0.1, 0.05);
      setTimeout(() => this.playTone(1320, 'sine', 0.1, 0.05), 50);
    },
    
    failure: () => {
      this.playTone(150, 'sawtooth', 0.3, 0.1);
      this.playTone(100, 'square', 0.3, 0.05);
    },
    
    click: () => {
      this.playTone(2000, 'sine', 0.02, 0.02);
    },
    
    card: () => {
      this.playTone(400, 'square', 0.05, 0.02);
      setTimeout(() => this.playTone(600, 'square', 0.05, 0.02), 30);
    }
  };

  // BGM management (requires user interaction to start)
  async loadBGM() {
    if (this.bgmLoaded) return;
    
    try {
      this.bgmAudio = new Audio('/bgm/bgm.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.3;
      this.bgmLoaded = true;
    } catch (err) {
      console.warn('BGM file not found:', err);
    }
  }

  async playBGM() {
    if (!this.bgmLoaded) {
      await this.loadBGM();
    }
    
    if (this.bgmAudio) {
      try {
        await this.bgmAudio.play();
      } catch (err) {
        console.warn('Could not play BGM:', err);
      }
    }
  }

  pauseBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
  }
}

// Singleton instance
export const AudioEngine = new AudioEngineClass();
