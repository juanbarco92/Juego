/**
 * LearningManager - Pedagogical Brain
 * Implements spaced repetition and adaptive word selection
 */
class LearningManager {
    constructor(curriculum) {
        this.curriculum = curriculum;
        this.learningHistory = this.loadHistory();
    }

    /**
     * Load learning history from localStorage
     */
    loadHistory() {
        const stored = localStorage.getItem('emma_learning_history');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            words: {}, // { "gato": { attempts: 5, successes: 4, lastSeen: timestamp, mastery: 0.8 } }
            sessions: [] // Array of session summaries
        };
    }

    /**
     * Save learning history to localStorage
     */
    saveHistory() {
        localStorage.setItem('emma_learning_history', JSON.stringify(this.learningHistory));
    }

    /**
     * Select next word set for level based on learning algorithm
     * @param {number} sessionProgress - Current position in session (0-1)
     * @param {number} levelsCompleted - Total levels completed in the session
     * @returns {Object} - { elements: [], theme: string, difficulty: number }
     */
    /**
     * Select next word set for level based on strictly isolated thematic units
     * Zero cross-category contamination: if theme is Food, only Food words appear!
     * @param {number} sessionProgress - Current position in session (0-1)
     * @param {number} levelsCompleted - Total levels completed in the session
     * @returns {Object} - { elements: [], theme: string, themeClass: string, difficulty: number }
     */
    selectNextWordSet(sessionProgress = 0, levelsCompleted = 0) {
        // 1. Get available units
        const units = (this.curriculum && this.curriculum.units && this.curriculum.units.length > 0) 
            ? this.curriculum.units 
            : [
                { id: "familia", name: "Mi Familia", icon: "👨‍👩‍👧", themeClass: "theme-family", words: ["Mamá", "Papá", "Emma", "bebé", "amigos"] },
                { id: "mascotas", name: "Mis Mascotas", icon: "🐾", themeClass: "theme-pets", words: ["perro", "gato", "conejo", "pollito", "gallo"] },
                { id: "frutas", name: "Frutas y Meriendas", icon: "🍓", themeClass: "theme-food", words: ["manzana", "fresa", "plátano", "uvas", "galleta", "helado"] },
                { id: "comida_mesa", name: "Rico en la Mesa", icon: "🥛", themeClass: "theme-food", words: ["pan", "leche", "huevo", "yogur", "brócoli"] },
                { id: "vehiculos", name: "¡A Viajar! Vehículos", icon: "🚗", themeClass: "theme-nature", words: ["carro", "avión", "tren", "barco", "bicicleta"] },
                { id: "juguetes", name: "Mis Juguetes", icon: "🧸", themeClass: "theme-pets", words: ["pelota", "oso", "robot", "tambor", "globo"] },
                { id: "naturaleza", name: "El Sol y el Parque", icon: "🌸", themeClass: "theme-nature", words: ["sol", "flor", "bote", "jardín"] },
                { id: "animales", name: "Animales Asombrosos", icon: "🦁", themeClass: "theme-animals", words: ["jirafa", "tigre", "caracol", "lobo"] },
                { id: "casa", name: "En Mi Casita", icon: "🏠", themeClass: "theme-home", words: ["mesa", "sofá", "lámpara", "jabón", "televisor"] },
                { id: "rutinas", name: "Mis Rutinas Diarias", icon: "⭐", themeClass: "theme-body", words: ["comer", "dormir", "cepillar", "vestir", "barrer"] }
            ];

        // 2. Select unit in rotation based on levelsCompleted
        const activeUnit = units[levelsCompleted % units.length];

        // 3. Determine difficulty (calibrated 2 to 3 words, max 4)
        let numActive = this.calculateDifficulty(levelsCompleted);
        numActive = Math.min(numActive, activeUnit.words.length);

        // 4. Select words within this unit using Spaced Repetition priority
        const scoredWords = activeUnit.words.map(w => ({
            word: w,
            score: this.calculateWordPriority(w)
        }));
        scoredWords.sort((a, b) => b.score - a.score);
        const selectedWords = scoredWords.slice(0, numActive).map(item => item.word);

        // 5. Assign to grid slots
        const elements = this.assignWordsToGrid(selectedWords);

        return {
            elements: elements,
            theme: `${activeUnit.icon} ${activeUnit.name}`,
            themeClass: activeUnit.themeClass || "theme-nature",
            unitId: activeUnit.id,
            difficulty: numActive
        };
    }

    /**
     * Get candidate words using spaced repetition algorithm
     */
    getCandidateWords(count) {
        const allWords = this.getAllWordsFromCurriculum();
        const scoredWords = allWords.map(word => ({
            word: word,
            score: this.calculateWordPriority(word)
        }));
        scoredWords.sort((a, b) => b.score - a.score);
        return scoredWords.slice(0, count).map(item => item.word);
    }

    /**
     * Calculate priority score for a word (0-1, higher = more priority)
     */
    calculateWordPriority(word) {
        const normKey = word.trim().normalize("NFC").toLowerCase();
        const wordData = this.learningHistory.words[normKey] || this.learningHistory.words[word];

        if (!wordData) {
            // New word - high priority
            return 0.9 + Math.random() * 0.1;
        }

        const mastery = wordData.mastery || 0;
        const daysSinceLastSeen = (Date.now() - wordData.lastSeen) / (1000 * 60 * 60 * 24);

        // Inverse mastery (less mastered = higher priority)
        const masteryScore = 1 - mastery;

        // Time decay (longer unseen = higher priority)
        const timeScore = Math.min(daysSinceLastSeen / 7, 1);

        return (masteryScore * 0.6 + timeScore * 0.4) + Math.random() * 0.1;
    }

    /**
     * Get all words from curriculum
     */
    getAllWordsFromCurriculum() {
        if (this.curriculum.units) {
            const set = new Set();
            this.curriculum.units.forEach(u => u.words.forEach(w => set.add(w)));
            return Array.from(set);
        }
        if (this.curriculum.wordSets) {
            const words = [];
            Object.values(this.curriculum.wordSets).forEach(level => {
                Object.values(level).forEach(category => {
                    words.push(...category.words);
                });
            });
            return words;
        }
        return ['Mamá', 'Papá', 'Emma', 'perro', 'gato', 'manzana'];
    }

    /**
     * Record a match attempt (success or failure)
     * @param {string} word - The word that was attempted
     * @param {boolean} success - Whether the match was correct
     */
    recordAttempt(word, success) {
        if (!word) return;
        const normKey = word.trim().normalize("NFC").toLowerCase();

        if (!this.learningHistory.words[normKey]) {
            this.learningHistory.words[normKey] = {
                displayName: word,
                attempts: 0,
                successes: 0,
                errors: 0,
                streak: 0,
                bestStreak: 0,
                firstSeen: Date.now(),
                lastSeen: Date.now(),
                mastery: 0
            };
        }

        const wordData = this.learningHistory.words[normKey];
        wordData.displayName = word; // Keep display formatting
        wordData.attempts = (wordData.attempts || 0) + 1;

        if (success) {
            wordData.successes = (wordData.successes || 0) + 1;
            wordData.streak = (wordData.streak || 0) + 1;
            if (wordData.streak > (wordData.bestStreak || 0)) {
                wordData.bestStreak = wordData.streak;
            }
        } else {
            wordData.errors = (wordData.errors || 0) + 1;
            wordData.streak = 0; // Reset consecutive streak on miss
        }

        wordData.lastSeen = Date.now();

        // Calculate mastery (weighted recent performance)
        const recentWeight = 0.7;
        const historicalAccuracy = wordData.attempts > 0 ? wordData.successes / wordData.attempts : 0;
        const currentResult = success ? 1 : 0;
        wordData.mastery = historicalAccuracy * (1 - recentWeight) + currentResult * recentWeight;

        // Also track in currentSession if active
        if (this.currentSession) {
            this.currentSession.totalAttempts = (this.currentSession.totalAttempts || 0) + 1;
            if (success) {
                this.currentSession.totalSuccesses = (this.currentSession.totalSuccesses || 0) + 1;
            }
        }

        this.saveHistory();
    }

    /**
     * Calculate difficulty (number of active objects) based on progress
     * Calibrated for ~4 years old: 3-4 objects (never overwhelming, sweet spot for focus)
     * @param {number} levelsCompleted - Total levels completed
     * @returns {number} - Number of active objects (2-5)
     */
    calculateDifficulty(levelsCompleted) {
        if (levelsCompleted === 0) return 2;  // Level 1: Gentle warm-up (binary choice)
        if (levelsCompleted <= 3) return 3;   // Levels 2-4: The ideal focus sweet spot (3 objects)
        if (levelsCompleted <= 8) return 4;   // Levels 5-9: Balanced challenge (2x2 grid, 4 objects)
        return 5;                             // Level 10+: Master challenge (max 5 objects)
    }

    /**
     * Assign words to grid positions (0-7)
     * Now fills exactly 8 slots: N with words, (8-N) with null
     * @param {string[]} words - Words to assign (2-8 words)
     * @returns {Array} - 8 elements with gridIndex (some may be null)
     */
    assignWordsToGrid(words) {
        // Assign sequential grid indices (0, 1, 2, ...)
        return words.map((word, index) => ({
            id: word.toLowerCase().replace(/\s/g, '_'),
            word: word,
            gridIndex: index,
            image: this.getImageForWord(word),
            emoji: this.getEmojiForWord(word)
        }));
    }

    /**
     * Get image path for a word
     * @param {string} word - Word to get image for
     * @returns {string|null} - Image path or null if not available
     */
    getImageForWord(word) {
        if (typeof AssetProvider !== 'undefined') {
            const asset = AssetProvider.getAsset(word);
            if (asset) return asset;
        }

        // Fallback to images directory
        const normalized = word.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/ñ/g, "n")
            .replace(/\s+/g, "_");

        return `images/elements/${normalized}.png`;
    }

    /**
     * Get emoji representation for a word (fallback if no image)
     * @param {string} word - Word to get emoji for
     * @returns {string} - Emoji character
     */
    getEmojiForWord(word) {
        const emojiMap = {
            // Family
            'Emma': '👧',
            'Benjamín': '👦',
            'Mamá': '👩',
            'Papá': '👨',
            'mamá': '👩',
            'papá': '👨',
            'bebé': '👶',

            // Animals
            'gato': '🐱',
            'perro': '🐶',
            'pájaro': '🐦',
            'pez': '🐠',

            // Nature
            'árbol': '🌳',
            'flor': '🌸',
            'sol': '☀️',
            'luna': '🌙',

            // Food
            'manzana': '🍎',
            'plátano': '🍌',
            'leche': '🥛',
            'pan': '🍞',

            // Objects
            'pelota': '⚽',
            'libro': '📚',
            'libros': '📚',
            'mesa': '🪑',
            'silla': '🪑',
            'cama': '🛏️',
            'sofa': '🛋️',
            'sofá': '🛋️',
            'ventana': '🪟',
            'puerta': '🚪',
            'televisión': '📺',
            'teléfono': '📱',
            'lámpara': '💡',
            'reloj': '⏰',

            // Places
            'casa': '🏠',
            'escuela': '🏫',
            'parque': '🌳',

            // Kitchen
            'nevera': '❄️',
            'estufa': '🔥',

            // Park
            'banco': '🪑'
        };

        return emojiMap[word] || '📦'; // Default emoji if not found
    }

    /**
     * Get mastery level for a word (0-1)
     */
    getWordMastery(word) {
        if (!word) return 0;
        const normKey = word.trim().normalize("NFC").toLowerCase();
        return this.learningHistory.words[normKey]?.mastery || this.learningHistory.words[word]?.mastery || 0;
    }

    /**
     * Get overall progress summary
     */
    getProgress() {
        const allWords = this.getAllWordsFromCurriculum();
        const stats = this.getDetailedWordStats();
        const masteredCount = stats.filter(s => s.statusClass === 'status-mastered').length;
        const inProgressCount = stats.filter(s => s.statusClass === 'status-progress').length;
        const practiceCount = stats.filter(s => s.statusClass === 'status-practice').length;
        
        let totalAttemptsAll = 0;
        let totalSuccessesAll = 0;
        stats.forEach(s => {
            totalAttemptsAll += s.attempts;
            totalSuccessesAll += s.successes;
        });

        const overallAccuracy = totalAttemptsAll > 0 
            ? Math.round((totalSuccessesAll / totalAttemptsAll) * 100) 
            : 0;

        const avgAttemptsGlobal = totalSuccessesAll > 0 
            ? (totalAttemptsAll / totalSuccessesAll).toFixed(1) 
            : '-';

        return {
            totalWords: allWords.length,
            wordsSeen: stats.filter(s => s.attempts > 0).length,
            wordsMastered: masteredCount,
            wordsInProgress: inProgressCount,
            wordsNeedPractice: practiceCount,
            overallProgress: allWords.length > 0 ? masteredCount / allWords.length : 0,
            overallAccuracy,
            avgAttemptsGlobal,
            totalAttempts: totalAttemptsAll,
            totalSuccesses: totalSuccessesAll
        };
    }

    /**
     * Get detailed word-by-word statistics for Parental Dashboard
     * @returns {Array<Object>}
     */
    getDetailedWordStats() {
        const stats = [];
        if (!this.curriculum.units) return stats;

        this.curriculum.units.forEach(unit => {
            unit.words.forEach(word => {
                const normKey = word.trim().normalize("NFC").toLowerCase();
                const wordData = this.learningHistory.words[normKey] || this.learningHistory.words[word] || {
                    attempts: 0,
                    successes: 0,
                    errors: 0,
                    streak: 0,
                    bestStreak: 0,
                    lastSeen: null,
                    mastery: 0
                };

                const attempts = wordData.attempts || 0;
                const successes = wordData.successes || 0;
                const errors = wordData.errors !== undefined ? wordData.errors : Math.max(0, attempts - successes);
                const accuracy = attempts > 0 ? Math.round((successes / attempts) * 100) : 0;
                const avgAttempts = successes > 0 
                    ? (attempts / successes).toFixed(1) 
                    : (attempts > 0 ? `${attempts}+` : '-');

                // Determine pedagogical mastery status
                let status = 'Por ver';
                let statusClass = 'status-new';
                let statusIcon = '⏳';

                if (attempts === 0) {
                    status = 'Por ver';
                    statusClass = 'status-new';
                    statusIcon = '⏳';
                } else if (successes >= 3 && accuracy >= 75) {
                    status = 'Dominada';
                    statusClass = 'status-mastered';
                    statusIcon = '⭐';
                } else if (successes >= 1 && accuracy >= 50) {
                    status = 'En progreso';
                    statusClass = 'status-progress';
                    statusIcon = '🚀';
                } else {
                    status = 'Por reforzar';
                    statusClass = 'status-practice';
                    statusIcon = '💡';
                }

                stats.push({
                    word,
                    normKey,
                    unitId: unit.id,
                    unitName: unit.name,
                    unitIcon: unit.icon,
                    attempts,
                    successes,
                    errors,
                    accuracy,
                    avgAttempts,
                    streak: wordData.streak || 0,
                    bestStreak: wordData.bestStreak || 0,
                    status,
                    statusClass,
                    statusIcon,
                    lastSeen: wordData.lastSeen,
                    asset: this.getImageForWord(word)
                });
            });
        });

        return stats;
    }

    /**
     * Start a new session
     */
    startSession() {
        this.currentSession = {
            startTime: Date.now(),
            levels: [],
            totalAttempts: 0,
            totalSuccesses: 0
        };
    }

    /**
     * End current session and save summary
     */
    endSession() {
        if (!this.currentSession) return;

        this.currentSession.endTime = Date.now();
        this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
        this.currentSession.accuracy = this.currentSession.totalSuccesses / this.currentSession.totalAttempts;

        this.learningHistory.sessions.push(this.currentSession);
        this.saveHistory();

        return this.currentSession;
    }
}

// Export for Node.js (tests) or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearningManager;
}

