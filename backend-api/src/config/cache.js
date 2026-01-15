/**
 * Cache Abstraction Layer
 *
 * This provides a cache interface that currently returns null (no-op).
 * Redis can be plugged in later WITHOUT any refactoring in services.
 *
 * Usage:
 *   const cache = require('./cache');
 *   await cache.get('key');
 *   await cache.set('key', value, 3600);
 *   await cache.del('key');
 */

class CacheAbstraction {
  constructor() {
    this.client = null; // Redis client will be assigned here later
    this.enabled = false;
  }

  /**
   * Initialize cache with Redis client (for future use)
   * @param {Object} redisClient - Redis client instance
   */
  init(redisClient) {
    this.client = redisClient;
    this.enabled = true;
    console.log('✅ Cache initialized with Redis');
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} - Cached value or null
   */
  async get(key) {
    if (!this.enabled || !this.client) {
      return null;
    }

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache GET error:', error.message);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (default: 1 hour)
   * @returns {Promise<boolean>} - Success status
   */
  async set(key, value, ttl = 3600) {
    if (!this.enabled || !this.client) {
      return false;
    }

    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache SET error:', error.message);
      return false;
    }
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - Success status
   */
  async del(key) {
    if (!this.enabled || !this.client) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache DEL error:', error.message);
      return false;
    }
  }

  /**
   * Delete multiple keys by pattern
   * @param {string} pattern - Key pattern (e.g., 'blog:*')
   * @returns {Promise<boolean>} - Success status
   */
  async delByPattern(pattern) {
    if (!this.enabled || !this.client) {
      return false;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Cache DEL pattern error:', error.message);
      return false;
    }
  }

  /**
   * Generate cache key
   * @param {string} prefix - Key prefix
   * @param {string} identifier - Unique identifier
   * @returns {string} - Cache key
   */
  generateKey(prefix, identifier) {
    return `${prefix}:${identifier}`;
  }
}

// Export singleton instance
module.exports = new CacheAbstraction();
