/**
 * RateLimiter - Controls API request rate
 * Helps avoid "too many requests" errors
 */
class RateLimiter {
    constructor(requestsPerMinute = 10) {
        this.requestsPerMinute = requestsPerMinute;
        this.minInterval = (60 * 1000) / requestsPerMinute; // ms between requests
        this.lastRequestTime = 0;
        this.queue = [];
        this.isProcessing = false;
    }

    /**
     * Wait before making a request to respect rate limits
     */
    async waitForSlot() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < this.minInterval) {
            const waitTime = this.minInterval - timeSinceLastRequest;
            console.log(`⏳ Rate limit: waiting ${(waitTime / 1000).toFixed(1)}s...`);
            await this.sleep(waitTime);
        }

        this.lastRequestTime = Date.now();
    }

    /**
     * Execute a function with rate limiting and retry logic
     */
    async execute(fn, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await this.waitForSlot();
                return await fn();
            } catch (error) {
                if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit')) {
                    if (attempt < retries) {
                        const backoffTime = Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30s
                        console.warn(`⚠️ Rate limit hit (attempt ${attempt}/${retries}), waiting ${(backoffTime / 1000).toFixed(1)}s...`);
                        await this.sleep(backoffTime);
                    } else {
                        throw new Error(`Rate limit exceeded after ${retries} attempts. Please wait a few minutes and try again.`);
                    }
                } else {
                    throw error; // Other errors, don't retry
                }
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for Node.js (tests) or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RateLimiter;
}
