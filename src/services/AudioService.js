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

        this.initAudioContext();
        this.initSpeech();
    }

    /**
     * Initialize Web Audio API for sound effects
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
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('click', unlockAudio);
        };
        window.addEventListener('touchstart', unlockAudio, { passive: true });
        window.addEventListener('click', unlockAudio, { passive: true });
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
     * Speak a word clearly and warmly
     * @param {string} word 
     */
    speakWord(word) {
        if (!this.enabled || !('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel(); // Stop previous voice
        const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
        if (this.voice) utterance.voice = this.voice;
        utterance.lang = 'es-ES';
        utterance.rate = 0.90;  // Ritmo pausado y claro para edad 3-4 años
        utterance.pitch = 1.0;  // Tono 1.0 (humano y natural, sin distorsión metálica)
        window.speechSynthesis.speak(utterance);
    }

    /**
     * Speak congratulatory praise
     * @param {string} word - The matched word
     */
    speakPraise(word) {
        if (!this.enabled || !('speechSynthesis' in window)) return;

        const randomPraise = this.praisePhrases[Math.floor(Math.random() * this.praisePhrases.length)];
        const text = `${randomPraise} ${word}`;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.voice) utterance.voice = this.voice;
        utterance.lang = 'es-ES';
        utterance.rate = 0.92;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
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
