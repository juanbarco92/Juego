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

        // UI callbacks
        this.callbacks = {
            onLevelReady: null,
            onMatchSuccess: null,
            onMatchError: null,
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
        console.log('🚀 Starting new session...');

        // Start session tracking
        this.sessionController.startSession();
        this.learningManager.startSession();

        // Setup session callbacks
        this.sessionController.on('tick', (remaining) => {
            if (this.callbacks.onSessionUpdate) {
                this.callbacks.onSessionUpdate(this.sessionController.getState());
            }
        });

        this.sessionController.on('end', (summary) => {
            this.handleSessionEnd(summary);
        });

        // Reset level counter
        this.levelsCompletedThisSession = 0;

        // Load first level
        await this.loadNextLevel();
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

        // Render level directly (no AI generation needed)
        this.renderLevel(levelData);
    }

    /**
     * Render a level to the game area
     */
    renderLevel(levelData) {
        // Filter out null slots to get active words
        const activeElements = levelData.elements.filter(el => el !== null);

        this.currentLevel = {
            data: levelData,
            words: activeElements.map(el => el.word),
            startTime: Date.now()
        };

        this.currentMatches = 0;
        this.totalMatches = activeElements.length; // Only count active elements

        if (this.callbacks.onLevelReady) {
            this.callbacks.onLevelReady(levelData);
        }

        console.log('✅ Level rendered:', this.totalMatches, 'words to match');
    }

    /**
     * Handle match attempt
     * @param {number} selectedGridIndex - Grid index that was clicked (0-7)
     * @param {string} targetWord - The word player is looking for
     */
    handleMatch(selectedGridIndex, targetWord) {
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
        console.log('✅ Correct match:', word);

        // Update learning data
        this.learningManager.recordAttempt(word, true);

        // Update match count
        this.currentMatches++;

        // Callback to UI
        if (this.callbacks.onMatchSuccess) {
            this.callbacks.onMatchSuccess(word, elementId);
        }

        // Check if level complete
        if (this.currentMatches >= this.totalMatches) {
            setTimeout(() => {
                this.handleLevelComplete();
            }, 1000);
        }
    }

    /**
     * Handle wrong match
     * @param {string} draggedWord - The word that was dragged (to record the attempt)
     */
    handleWrongMatch(draggedWord) {
        console.log('❌ Wrong match:', draggedWord);

        // Record failed attempt for the word that was dragged
        this.learningManager.recordAttempt(draggedWord, false);

        // Callback to UI
        if (this.callbacks.onMatchError) {
            this.callbacks.onMatchError(draggedWord);
        }
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

        // Callback to UI
        if (this.callbacks.onLevelComplete) {
            this.callbacks.onLevelComplete({
                levelNumber: this.levelsCompletedThisSession,
                duration: levelDuration,
                words: this.currentLevel.words
            });
        }

        // Auto-load next level after celebration
        setTimeout(() => {
            if (this.sessionController.isActive()) {
                this.loadNextLevel();
            }
        }, 2000);
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
