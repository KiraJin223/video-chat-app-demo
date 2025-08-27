// Local storage utility class for caching UserSig and other data

interface CacheItem<T> {
  data: T;
  expiry: number;
}

class StorageManager {
  private static instance: StorageManager;
  private readonly prefix = 'video_chat_app_';

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Set cache data
   * @param key Cache key
   * @param data Cache data
   * @param ttlInMinutes Expiration time (minutes)
   */
  public set<T>(key: string, data: T, ttlInMinutes = 60): void {
    try {
      const item: CacheItem<T> = {
        data,
        expiry: Date.now() + ttlInMinutes * 60 * 1000,
      };
      
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify(item)
      );
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  /**
   * Get cache data
   * @param key Cache key
   * @returns Cached data or null
   */
  public get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) {
        return null;
      }

      const item: CacheItem<T> = JSON.parse(itemStr);
      
      // Check if expired
      if (Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove cache data
   * @param key Cache key
   */
  public remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Clear all cache
   */
  public clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Check if browser supports localStorage
   */
  public isSupported(): boolean {
    try {
      const testKey = this.prefix + 'test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

// UserSig cache related specific methods
export class UserSigCache {
  private storage = StorageManager.getInstance();

  /**
   * Cache UserSig
   * @param userID User ID
   * @param userSigData UserSig data
   */
  public cacheUserSig(userID: string, userSigData: any): void {
    // Calculate remaining valid time (minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = Math.max(0, userSigData.expireTime - currentTime);
    const ttlInMinutes = Math.floor(remainingTime / 60) - 5; // Expire 5 minutes early

    if (ttlInMinutes > 0) {
      this.storage.set(`usersig_${userID}`, userSigData, ttlInMinutes);
      console.log(`📦 UserSig cached for ${userID}, TTL: ${ttlInMinutes} minutes`);
    }
  }

  /**
   * Get cached UserSig
   * @param userID User ID
   * @returns Cached UserSig or null
   */
  public getCachedUserSig(userID: string): any | null {
    const cached = this.storage.get(`usersig_${userID}`);
    if (cached) {
      console.log(`📦 UserSig loaded from cache for ${userID}`);
    }
    return cached;
  }

  /**
   * Clear user's UserSig cache
   * @param userID User ID
   */
  public clearUserSig(userID: string): void {
    this.storage.remove(`usersig_${userID}`);
    console.log(`🗑️ UserSig cache cleared for ${userID}`);
  }

  /**
   * Clear all UserSig cache
   */
  public clearAllUserSig(): void {
    // More precise cleanup logic can be implemented here
    this.storage.clear();
    console.log('🗑️ All UserSig cache cleared');
  }
}

// Export singleton instances
export const userSigCache = new UserSigCache();
export const storage = StorageManager.getInstance();
