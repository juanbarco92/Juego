/**
 * GameEngine - Core game orchestrator
 * Integrates all components: LearningManager, SessionController, LevelBuffer, etc.
 */
class GameEngine {
    constructor(curriculum) {
        // Load curriculum
        this.curriculum = curriculum;

        // Initialize managers
        this.learningManager = new LearningManager(curriculum);
        this.sessionController = new SessionController();
        this.storageManager = new StorageManager();

        // Initialize services (will be set externally)
        this.geminiGenerator = null;
        this.levelBuffer = null;

        // Game state
        this.currentLevel = null;
        this.currentMatches = 0;
        this.totalMatches = 0;
        this.levelsCompletedThisSession = 0;
        this.levelPhase = 'sound'; // 'sound' (Fase 1 con sonido) | 'silent' (Fase 2 sin sonido)
        this.isRestarting = false; // Candado para evitar carreras durante el reinicio por error

        // UI callbacks
        this.callbacks = {
            onLevelReady: null,
            onMatchSuccess: null,
            onMatchError: null,
            onPhaseComplete: null,
            onLevelRestart: null,
            onLevelComplete: null,
            onSessionUpdate: null,
            onSessionEnd: null
        };

        console.log('🎮 GameEngine initialized');
    }

    /**
     * Start a new learning session
     */
    async startSession() {
        console.log('🚀 Starting/resuming session...');

        const wasActive = this.sessionController.sessionActive;

        // Start session tracking (persists today's progress)
        this.sessionController.startSession();
        if (!wasActive) {
            this.learningManager.startSession();
            this.levelsCompletedThisSession = 0;
        }

        // Setup session callbacks
        this.sessionController.on('tick', (remaining) => {
            if (this.callbacks.onSessionUpdate) {
                this.callbacks.onSessionUpdate(this.sessionController.getState());
            }
        });

        this.sessionController.on('end', (summary) => {
            this.handleSessionEnd(summary);
        });

        // Load level if none is active
        if (!this.currentLevel) {
            await this.loadNextLevel();
        }
    }

    /**
     * Start playing immediately with a specific thematic word set (e.g. from Beach Chests)
     */
    async startWithWordSet(words, themeName, themeClass = '') {
        const wasActive = this.sessionController.sessionActive;
        this.sessionController.startSession();
        if (!wasActive) {
            this.learningManager.startSession();
            this.levelsCompletedThisSession = 0;
        }

        // Choose up to 4 words for a balanced 4-spot level
        const selectedWords = (words && words.length > 0) ? words.slice(0, 4) : ["Mamá", "Papá", "Emma"];
        const elements = selectedWords.map((word, idx) => ({
            word: word,
            gridIndex: idx,
            image: (typeof AssetProvider !== 'undefined') ? AssetProvider.getAsset(word) : `images/elements/${word.toLowerCase()}.png`
        }));

        const levelData = {
            elements: elements,
            difficulty: elements.length,
            theme: themeName ? `🌟 ${themeName}` : '🌟 ¡A descubrir palabras!',
            themeClass: themeClass || 'theme-family'
        };

        this.levelPhase = 'sound';
        this.isRestarting = false;
        this.renderLevel(levelData, 'sound');
    }

    /**
     * Load next level dynamically
     */
    async loadNextLevel() {
        console.log('📚 Loading next level...');

        // Select words using LearningManager with difficulty
        const levelData = this.learningManager.selectNextWordSet(
            this.levelsCompletedThisSession / 10, // Progress 0-1
            this.levelsCompletedThisSession // Levels for difficulty
        );

        console.log('📝 Selected words:', levelData.elements.map(e => e.word));
        console.log('🎯 Difficulty:', levelData.difficulty, 'active objects');
        console.log('🎨 Theme:', levelData.theme);

        this.levelPhase = 'sound';
        this.isRestarting = false;
        this.renderLevel(levelData, 'sound');
    }

    /**
     * Render a level to the game area
     * @param {Object} levelData - Data for the level (elements, theme, etc.)
     * @param {string} phase - 'sound' (Fase 1 con voz) or 'silent' (Fase 2 sin voz)
     * @param {boolean} isRestart - True if restarted due to an error
     */
    renderLevel(levelData, phase = 'sound', isRestart = false) {
        this.levelPhase = phase;
        this.isRestarting = false;

        // Filter out null slots to get active words
        const activeElements = levelData.elements.filter(el => el !== null);

        this.currentLevel = {
            data: levelData,
            words: activeElements.map(el => el.word),
            startTime: (isRestart && this.currentLevel) ? this.currentLevel.startTime : Date.now()
        };

        this.currentMatches = 0;
        this.totalMatches = activeElements.length; // Only count active elements

        if (this.callbacks.onLevelReady) {
            this.callbacks.onLevelReady({
                ...levelData,
                phase: this.levelPhase,
                isRestart: isRestart
            });
        }

        console.log(`✅ Level rendered [Fase: ${this.levelPhase}, Reinicio: ${isRestart}]:`, this.totalMatches, 'words to match');
    }

    /**
     * Handle match attempt
     * @param {number} selectedGridIndex - Grid index that was clicked (0-7)
     * @param {string} targetWord - The word player is looking for
     */
    handleMatch(selectedGridIndex, targetWord) {
        if (this.isRestarting) return false;

        // Find the element at the selected grid index
        const selectedElement = this.currentLevel.data.elements
            .find(el => el.gridIndex === selectedGridIndex);

        if (!selectedElement) {
            console.warn('No element found at grid index:', selectedGridIndex);
            return false;
        }

        const isCorrect = selectedElement.word.trim().normalize("NFC").toLowerCase() === targetWord.trim().normalize("NFC").toLowerCase();

        if (isCorrect) {
            this.handleCorrectMatch(selectedElement.word, selectedGridIndex);
        } else {
            this.handleWrongMatch(targetWord);
        }

        return isCorrect;
    }

    /**
     * Handle correct match
     */
    handleCorrectMatch(word, elementId) {
        console.log(`✅ Correct match: ${word} [Fase: ${this.levelPhase}]`);

        // Update learning data
        this.learningManager.recordAttempt(word, true);

        // Update match count
        this.currentMatches++;

        // Callback to UI
        if (this.callbacks.onMatchSuccess) {
            this.callbacks.onMatchSuccess(word, elementId, this.levelPhase);
        }

        // Check if all words in current phase matched
        if (this.currentMatches >= this.totalMatches) {
            if (this.levelPhase === 'sound') {
                // Completed Phase 1 (con sonido) -> transition to Phase 2 (sin sonido, mismo nivel)
                setTimeout(() => {
                    this.transitionToSilentPhase();
                }, 900);
            } else {
                // Completed Phase 2 (sin sonido) -> Full level completion!
                setTimeout(() => {
                    this.handleLevelComplete();
                }, 900);
            }
        }
    }

    /**
     * Transition to Phase 2 (Silent reading of the same word set)
     */
    transitionToSilentPhase() {
        console.log('🤫 Transitioning to silent phase for the same level...');
        this.levelPhase = 'silent';

        if (this.callbacks.onPhaseComplete) {
            this.callbacks.onPhaseComplete({
                previousPhase: 'sound',
                newPhase: 'silent',
                levelData: this.currentLevel.data
            });
        }

        // Wait 1.4s for celebration banner, then re-render in silent mode
        setTimeout(() => {
            if (this.currentLevel && this.currentLevel.data) {
                this.renderLevel(this.currentLevel.data, 'silent', false);
            }
        }, 1400);
    }

    /**
     * Handle wrong match - Reinforce learning by restarting the level
     * @param {string} draggedWord - The word that was dragged (to record the attempt)
     */
    handleWrongMatch(draggedWord) {
        console.log(`❌ Wrong match: ${draggedWord} [Fase: ${this.levelPhase}] -> Reiniciando nivel para reforzar`);

        // Prevent rapid repeated drops during restart cooldown
        this.isRestarting = true;

        // Record failed attempt for the word that was dragged
        this.learningManager.recordAttempt(draggedWord, false);

        // Callback to UI for gentle visual/audio cues
        if (this.callbacks.onMatchError) {
            this.callbacks.onMatchError(draggedWord, this.levelPhase);
        }

        // Restart current level phase after 1.1s so Emma understands the feedback
        setTimeout(() => {
            this.restartCurrentLevel(draggedWord);
        }, 1100);
    }

    /**
     * Restart the current level phase to reinforce words
     */
    restartCurrentLevel(failedWord) {
        if (!this.currentLevel || !this.currentLevel.data) {
            this.isRestarting = false;
            return;
        }

        console.log(`🔄 Restarting level in phase: ${this.levelPhase}`);

        if (this.callbacks.onLevelRestart) {
            this.callbacks.onLevelRestart({
                phase: this.levelPhase,
                failedWord: failedWord,
                levelData: this.currentLevel.data
            });
        }

        // Re-render level in current phase with isRestart = true
        this.renderLevel(this.currentLevel.data, this.levelPhase, true);
    }

    /**
     * Handle level completion
     */
    handleLevelComplete() {
        const levelDuration = Date.now() - this.currentLevel.startTime;
        this.levelsCompletedThisSession++;

        console.log('🎉 Level complete! Duration:', (levelDuration / 1000).toFixed(1), 's');

        // Record in session
        if (this.learningManager.currentSession) {
            this.learningManager.currentSession.levels.push({
                words: this.currentLevel.words,
                duration: levelDuration,
                completedAt: Date.now()
            });
        }

        // Callback to UI (UI controls the celebration and next action)
        if (this.callbacks.onLevelComplete) {
            this.callbacks.onLevelComplete({
                levelNumber: this.levelsCompletedThisSession,
                duration: levelDuration,
                words: this.currentLevel.words,
                levelData: this.currentLevel.data
            });
        }
    }

    /**
     * Handle session end
     */
    handleSessionEnd(summary) {
        console.log('🏁 Session ended:', summary);

        // End learning session
        const sessionData = this.learningManager.endSession();

        // Save to storage
        this.storageManager.saveSessionSummary({
            ...summary,
            ...sessionData,
            levelsCompleted: this.levelsCompletedThisSession,
            progress: this.learningManager.getProgress()
        });

        // Clear level buffer
        if (this.levelBuffer) {
            this.levelBuffer.clearBuffer();
        }

        // Callback to UI
        if (this.callbacks.onSessionEnd) {
            this.callbacks.onSessionEnd({
                ...summary,
                levelsCompleted: this.levelsCompletedThisSession,
                progress: this.learningManager.getProgress()
            });
        }
    }

    /**
     * Handle generation error (fallback)
     */
    handleGenerationError(wordSet) {
        console.warn('⚠️ Using fallback for:', wordSet.words);

        // Create simple fallback level
        const fallbackLevel = this.createFallbackLevel(wordSet.words, wordSet.theme);
        this.renderLevel(fallbackLevel);
    }

    /**
     * Create fallback level (emoji-based, grid layout)
     */
    createFallbackLevel(elements, targetWord, theme) {
        return {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            elements: elements,
            targetWord: targetWord,
            isFallback: true
        };
    }

    /**
     * Pause current session
     */
    pauseSession() {
        this.sessionController.pauseSession();
    }

    /**
     * Resume current session
     */
    resumeSession() {
        this.sessionController.resumeSession();
    }

    /**
     * End session manually
     */
    endSessionManually() {
        this.sessionController.endSession();
    }

    /**
     * Register callback
     */
    on(event, callback) {
        if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase() + event.slice(1)}`)) {
            this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
        }
    }

    /**
     * Get current game state
     */
    getState() {
        return {
            session: this.sessionController.getState(),
            progress: this.learningManager.getProgress(),
            currentLevel: {
                matches: this.currentMatches,
                total: this.totalMatches,
                number: this.levelsCompletedThisSession
            }
        };
    }
}

// Export for Node.js (tests) or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}
