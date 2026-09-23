/**
 * StorageManager - localStorage abstraction layer
 * Handles all persistent data storage with versioning and migration
 */
class StorageManager {
    constructor() {
        this.version = '1.0';
        this.keys = {
            LEARNING_HISTORY: 'emma_learning_history',
            SESSION_SUMMARIES: 'emma_session_summaries',
            APP_VERSION: 'emma_app_version',
            LAST_SESSION: 'emma_last_session',
            CACHED_LEVELS: 'emma_cached_levels'
        };

        this.checkVersion();
    }

    /**
     * Check version and migrate data if needed
     */
    checkVersion() {
        const storedVersion = localStorage.getItem(this.keys.APP_VERSION);

        if (!storedVersion) {
            // First time - initialize
            localStorage.setItem(this.keys.APP_VERSION, this.version);
            console.log('📦 StorageManager: Initialized version', this.version);
        } else if (storedVersion !== this.version) {
            // Version mismatch - migrate
            console.log(`🔄 StorageManager: Migrating from ${storedVersion} to ${this.version}`);
            this.migrate(storedVersion, this.version);
            localStorage.setItem(this.keys.APP_VERSION, this.version);
        }
    }

    /**
     * Migrate data between versions
     */
    migrate(fromVersion, toVersion) {
        console.log(`Migration not needed for ${fromVersion} → ${toVersion}`);
        // Future migrations will be added here
    }

    /**
     * Save learning history
     */
    saveLearningHistory(history) {
        try {
            localStorage.setItem(this.keys.LEARNING_HISTORY, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('❌ Failed to save learning history:', error);
            return false;
        }
    }

    /**
     * Load learning history
     */
    loadLearningHistory() {
        try {
            const data = localStorage.getItem(this.keys.LEARNING_HISTORY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Failed to load learning history:', error);
            return null;
        }
    }

    /**
     * Get word mastery data
     */
    getWordMastery(word) {
        const history = this.loadLearningHistory();
        return history?.words?.[word] || null;
    }

    /**
     * Save session summary
     */
    saveSessionSummary(session) {
        try {
            let summaries = this.loadSessionSummaries() || [];
            summaries.push(session);

            // Keep only last 50 sessions
            if (summaries.length > 50) {
                summaries = summaries.slice(-50);
            }

            localStorage.setItem(this.keys.SESSION_SUMMARIES, JSON.stringify(summaries));
            localStorage.setItem(this.keys.LAST_SESSION, JSON.stringify(session));
            return true;
        } catch (error) {
            console.error('❌ Failed to save session:', error);
            return false;
        }
    }

    /**
     * Load all session summaries
     */
    loadSessionSummaries() {
        try {
            const data = localStorage.getItem(this.keys.SESSION_SUMMARIES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Failed to load sessions:', error);
            return [];
        }
    }

    /**
     * Get last session data
     */
    getLastSession() {
        try {
            const data = localStorage.getItem(this.keys.LAST_SESSION);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Failed to load last session:', error);
            return null;
        }
    }

    /**
     * Cache a generated level
     */
    cacheLevel(wordList, levelData) {
        try {
            const cache = this.loadCachedLevels();
            const key = wordList.sort().join('_');

            cache[key] = {
                levelData,
                cachedAt: Date.now(),
                wordList
            };

            // Limit cache size (keep last 20 levels)
            const entries = Object.entries(cache);
            if (entries.length > 20) {
                entries.sort((a, b) => b[1].cachedAt - a[1].cachedAt);
                const limitedCache = {};
                entries.slice(0, 20).forEach(([k, v]) => limitedCache[k] = v);
                localStorage.setItem(this.keys.CACHED_LEVELS, JSON.stringify(limitedCache));
            } else {
                localStorage.setItem(this.keys.CACHED_LEVELS, JSON.stringify(cache));
            }

            return true;
        } catch (error) {
            console.error('❌ Failed to cache level:', error);
            return false;
        }
    }

    /**
     * Get cached level
     */
    getCachedLevel(wordList) {
        try {
            const cache = this.loadCachedLevels();
            const key = wordList.sort().join('_');
            const cached = cache[key];

            if (cached) {
                const age = Date.now() - cached.cachedAt;
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

                if (age < maxAge) {
                    console.log('✅ Using cached level for:', wordList);
                    return cached.levelData;
                }
            }

            return null;
        } catch (error) {
            console.error('❌ Failed to get cached level:', error);
            return null;
        }
    }

    /**
     * Load all cached levels
     */
    loadCachedLevels() {
        try {
            const data = localStorage.getItem(this.keys.CACHED_LEVELS);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('❌ Failed to load cache:', error);
            return {};
        }
    }

    /**
     * Clear all cached levels
     */
    clearCache() {
        localStorage.removeItem(this.keys.CACHED_LEVELS);
        console.log('🗑️ Cache cleared');
    }

    /**
     * Get storage statistics
     */
    getStats() {
        const history = this.loadLearningHistory();
        const sessions = this.loadSessionSummaries();
        const cache = this.loadCachedLevels();

        return {
            version: this.version,
            wordsTracked: history ? Object.keys(history.words).length : 0,
            sessionsRecorded: sessions.length,
            cachedLevels: Object.keys(cache).length,
            storageUsed: this.calculateStorageSize()
        };
    }

    /**
     * Calculate approximate localStorage usage
     */
    calculateStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return `${(total / 1024).toFixed(2)} KB`;
    }

    /**
     * Clear all app data
     */
    clearAll() {
        Object.values(this.keys).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('🗑️ All data cleared');
    }
}

// Export for Node.js (tests) or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
