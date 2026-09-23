/**
 * SessionController - Manages session timing and user experience
 */
class SessionController {
    constructor() {
        this.maxDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
        this.warningThreshold = 2 * 60 * 1000; // Warn at 2 minutes remaining
        this.sessionActive = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.isPaused = false;
        this.savedAccumulatedMs = this.loadTodayProgress();
        this.callbacks = {
            onTick: null,
            onWarning: null,
            onEnd: null
        };
    }

    /**
     * Get storage key for today's session
     */
    getTodayKey() {
        const d = new Date();
        return `emma_session_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;
    }

    /**
     * Load today's accumulated play time
     */
    loadTodayProgress() {
        try {
            const key = this.getTodayKey();
            const stored = localStorage.getItem(key);
            return stored ? parseInt(stored, 10) || 0 : 0;
        } catch (e) {
            return 0;
        }
    }

    /**
     * Save today's accumulated play time
     */
    saveTodayProgress(elapsed) {
        try {
            const key = this.getTodayKey();
            localStorage.setItem(key, Math.floor(elapsed));
        } catch (e) {}
    }

    /**
     * Reset session progress (for parents or explicit restart)
     */
    resetSession() {
        try {
            localStorage.removeItem(this.getTodayKey());
        } catch (e) {}
        this.savedAccumulatedMs = 0;
        this.startTime = Date.now();
        this.pausedTime = 0;
        this.isPaused = false;
        this.saveTodayProgress(0);
        if (this.callbacks.onTick) {
            this.callbacks.onTick(this.maxDuration);
        }
    }

    /**
     * Start or resume session
     */
    startSession() {
        // If already active, DO NOT reset! Simply resume if paused.
        if (this.sessionActive) {
            if (this.isPaused) {
                this.resumeSession();
            }
            return {
                startTime: this.startTime,
                maxDuration: this.maxDuration
            };
        }

        this.sessionActive = true;
        this.savedAccumulatedMs = this.loadTodayProgress();
        // Start time incorporates prior progress today
        this.startTime = Date.now() - this.savedAccumulatedMs;
        this.pausedTime = 0;
        this.isPaused = false;
        this.startTimer();

        console.log('📚 Session started/resumed - Daily elapsed:', Math.floor(this.savedAccumulatedMs / 1000), 's');
        return {
            startTime: this.startTime,
            maxDuration: this.maxDuration
        };
    }

    /**
     * Internal timer loop
     */
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            if (!this.isPaused && this.sessionActive) {
                const elapsed = this.getElapsedTime();
                const remaining = this.getRemainingTime();

                // Persist progress
                this.saveTodayProgress(elapsed);

                // Trigger callbacks
                if (this.callbacks.onTick) {
                    this.callbacks.onTick(remaining);
                }

                // Warning threshold
                if (remaining <= this.warningThreshold && remaining > this.warningThreshold - 1000) {
                    if (this.callbacks.onWarning) {
                        this.callbacks.onWarning(remaining);
                    }
                    console.log('⚠️ Session warning: 2 minutes remaining');
                }

                // Session end
                if (remaining <= 0) {
                    this.endSession();
                }
            }
        }, 1000); // Update every second
    }

    /**
     * Pause the session
     */
    pauseSession() {
        if (!this.sessionActive || this.isPaused) return;

        this.isPaused = true;
        this.pauseStartTime = Date.now();
        this.saveTodayProgress(this.getElapsedTime());
        console.log('⏸️ Session paused');
    }

    /**
     * Resume the session
     */
    resumeSession() {
        if (!this.sessionActive || !this.isPaused) return;

        this.pausedTime += Date.now() - this.pauseStartTime;
        this.isPaused = false;
        console.log('▶️ Session resumed');
    }

    /**
     * End the session
     */
    endSession() {
        this.sessionActive = false;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const sessionData = this.getSessionSummary();

        if (this.callbacks.onEnd) {
            this.callbacks.onEnd(sessionData);
        }

        console.log('🎓 Session ended', sessionData);
        return sessionData;
    }

    /**
     * Get remaining time in milliseconds
     */
    getRemainingTime() {
        if (!this.sessionActive) return 0;

        const elapsed = this.getElapsedTime();
        const remaining = this.maxDuration - elapsed;
        return Math.max(0, remaining);
    }

    /**
     * Get elapsed time in milliseconds (excluding paused time)
     */
    getElapsedTime() {
        if (!this.startTime) return 0;

        let elapsed = Date.now() - this.startTime - this.pausedTime;

        // If currently paused, don't count current pause period
        if (this.isPaused) {
            elapsed -= (Date.now() - this.pauseStartTime);
        }

        return Math.max(0, elapsed);
    }

    /**
     * Get formatted time string (MM:SS)
     */
    getFormattedTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Get session summary
     */
    getSessionSummary() {
        return {
            duration: this.getElapsedTime(),
            formattedDuration: this.getFormattedTime(this.getElapsedTime()),
            targetDuration: this.maxDuration,
            completed: this.getElapsedTime() >= this.maxDuration,
            pausedTime: this.pausedTime
        };
    }

    /**
     * Register callbacks
     */
    on(event, callback) {
        if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase() + event.slice(1)}`)) {
            this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
        }
    }

    /**
     * Check if session is active
     */
    isActive() {
        return this.sessionActive;
    }

    /**
     * Get session state
     */
    getState() {
        return {
            active: this.sessionActive,
            paused: this.isPaused,
            remaining: this.getRemainingTime(),
            elapsed: this.getElapsedTime(),
            formattedRemaining: this.getFormattedTime(this.getRemainingTime()),
            formattedElapsed: this.getFormattedTime(this.getElapsedTime())
        };
    }
}

// Export for Node.js (tests) or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionController;
}
