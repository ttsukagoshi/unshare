class MockCacheService {
  static getUserCache() {
    return new MockCache();
  }
}
class MockCache {
  constructor() {
    this.cache = {};
    this.expirationInSec = 3600;
  }
  /**
   * @param {String} cacheKey
   * @returns {String}
   */
  get(cacheKey) {
    return this.cache[cacheKey] || null;
  }
  /**
   * @param {String} cacheKey
   * @param {String} cacheValue
   * @param {Number} expirationInSec
   */
  put(cacheKey, cacheValue, expirationInSec) {
    this.cache[cacheKey] = cacheValue;
    this.expirationInSec = expirationInSec;
  }
}

module.exports = { MockCacheService };
