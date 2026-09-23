/**
 * AudioService - Complete audio & voice engine for Emma Aprende
 * Uses Web Speech API for voice & Web Audio API for sound effects (100% offline & zero latency)
 */
class AudioService {
    constructor() {
        this.enabled = true;
        this.voice = null;
        this.audioCtx = null;

        this.praisePhrases = [
            '¡Muy bien!',
            '¡Excelente!',
            '¡Qué bien!',
            '¡Genial!',
            '¡Eso es!',
            '¡Lo hiciste increíble!',
            '¡Bravo!'
        ];

        this.audioPool = new Map();
        this.currentAudio = null;

        this.initAudioContext();
        this.initSpeech();
        this.preloadPraises();
    }

    /**
     * Initialize Web Audio API for sound effects and unlock iOS media pipeline
     */
    initAudioContext() {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            this.audioCtx = new AudioContextClass();
        }

        // Unlock audio on iOS Safari upon first user interaction
        const unlockAudio = () => {
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            // Unlock HTML5 Audio element pipeline on iOS Safari
            try {
                const dummy = new Audio();
                dummy.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
                dummy.play().catch(() => {});
            } catch (e) {}

            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('click', unlockAudio);
        };
        window.addEventListener('touchstart', unlockAudio, { passive: true });
        window.addEventListener('click', unlockAudio, { passive: true });
    }

    /**
     * Preload praise audio clips into memory
     */
    preloadPraises() {
        for (let i = 1; i <= 8; i++) {
            const key = `praise_${i}`;
            if (!this.audioPool.has(key)) {
                try {
                    const audio = new Audio(`audio/praise/praise_${i}.mp3`);
                    audio.preload = 'auto';
                    audio.load();
                    this.audioPool.set(key, audio);
                } catch (e) {}
            }
        }
    }

    /**
     * Preload word audio clips into memory for instant zero-latency playback
     * @param {string[]} words 
     */
    preloadWords(words) {
        if (!words || !Array.isArray(words)) return;
        words.forEach(word => {
            if (!word) return;
            const normalized = word.toLowerCase().trim()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
            if (!this.audioPool.has(normalized)) {
                try {
                    const audio = new Audio(`audio/words/${normalized}.mp3`);
                    audio.preload = 'auto';
                    audio.load();
                    this.audioPool.set(normalized, audio);
                } catch (e) {}
            }
        });
    }

    /**
     * Initialize Web Speech API
     */
    initSpeech() {
        if (!('speechSynthesis' in window)) {
            console.warn('⚠️ Web Speech API not supported on this browser');
            return;
        }

        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            // Priorizar voces naturales/neuronales en español
            this.voice = voices.find(v => v.lang.startsWith('es') && (
                v.name.includes('Natural') || 
                v.name.includes('Online') || 
                v.name.includes('Neural') || 
                v.name.includes('Google') || 
                v.name.includes('Paulina') || 
                v.name.includes('Salma') || 
                v.name.includes('Dalia') || 
                v.name.includes('Sabina')
            ))
            || voices.find(v => v.lang.startsWith('es'))
            || null;
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    /**
     * Speak a word clearly and instantly using in-memory preloaded audio
     * @param {string} word 
     */
    speakWord(word) {
        if (!this.enabled || !word) return;

        const normalized = word.toLowerCase().trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");

        // Stop any currently playing speech audio
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            } catch (e) {}
        }

        // Get from in-memory preloaded pool or create
        let audio = this.audioPool.get(normalized);
        if (!audio) {
            audio = new Audio(`audio/words/${normalized}.mp3`);
            audio.preload = 'auto';
            this.audioPool.set(normalized, audio);
        }

        this.currentAudio = audio;
        audio.currentTime = 0;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // If MP3 file not found, fallback to Web Speech
                this.speakWithSynthesis(word);
            });
        }
    }

    /**
     * Fallback speech synthesis when MP3 is missing
     */
    speakWithSynthesis(word) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
        if (this.voice) utterance.voice = this.voice;
        utterance.lang = 'es-CO';
        utterance.rate = 0.90;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }

    /**
     * Speak congratulatory praise using neural MP3 instantly
     * @param {string} word - The matched word
     */
    speakPraise(word) {
        if (!this.enabled) return;

        // Stop previous audio
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            } catch (e) {}
        }

        // Random praise audio (praise_1 to praise_8)
        const praiseNum = Math.floor(Math.random() * 8) + 1;
        const key = `praise_${praiseNum}`;
        let audio = this.audioPool.get(key);
        if (!audio) {
            audio = new Audio(`audio/praise/${key}.mp3`);
            audio.preload = 'auto';
            this.audioPool.set(key, audio);
        }

        this.currentAudio = audio;
        audio.currentTime = 0;

        audio.onended = () => {
            if (word) {
                this.speakWord(word);
            }
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                this.speakWord(word);
            });
        }
    }

    /**
     * Synthesize a gentle bubble pop sound (when touching a card)
     */
    playPop() {
        if (!this.enabled || !this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {
            console.debug('Audio error:', e);
        }
    }

    /**
     * Synthesize a magical chest open harp sparkle sound
     */
    playChestOpen() {
        if (!this.enabled || !this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            // Ethereal pentatonic harp chime: D5 - F#5 - A5 - D6 - F#6
            const freqs = [587.33, 739.99, 880.00, 1174.66, 1479.98];
            freqs.forEach((freq, idx) => {
                const noteTime = now + idx * 0.055;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0, noteTime);
                gain.gain.linearRampToValueAtTime(0.22, noteTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.45);
            });
        } catch (e) {
            console.debug('Audio error:', e);
        }
    }

    /**
     * Synthesize a sweet celestial chime when matching a word
     */
    playSuccess() {
        if (!this.enabled || !this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            // Warm major chord arpeggio (C5 - E5 - G5 - C6)
            const notes = [523.25, 659.25, 783.99, 1046.50];

            notes.forEach((freq, idx) => {
                const noteTime = now + idx * 0.07;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0, noteTime);
                gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.4);
            });
        } catch (e) {
            console.debug('Audio error:', e);
        }
    }

    /**
     * Synthesize a soft gentle wiggle (when choosing wrong) - playful, never punitive
     */
    playGentleBounce() {
        if (!this.enabled || !this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.linearRampToValueAtTime(260, now + 0.12);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {
            console.debug('Audio error:', e);
        }
    }

    /**
     * Joyful fanfare when completing a level
     */
    playFanfare() {
        if (!this.enabled || !this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            // Joyful chord melody (G4, C5, E5, G5)
            const notes = [
                { freq: 392.00, delay: 0, dur: 0.15 },
                { freq: 523.25, delay: 0.12, dur: 0.15 },
                { freq: 659.25, delay: 0.24, dur: 0.20 },
                { freq: 783.99, delay: 0.40, dur: 0.50 }
            ];

            notes.forEach(({ freq, delay, dur }) => {
                const noteTime = now + delay;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0, noteTime);
                gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + dur);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + dur);
            });
        } catch (e) {
            console.debug('Audio error:', e);
        }
    }

    /**
     * Toggle audio mute
     */
    toggleMute() {
        this.enabled = !this.enabled;
        if (!this.enabled && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        return this.enabled;
    }
}

// Global or module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioService;
}
if (typeof window !== 'undefined') {
    window.AudioService = AudioService;
}
