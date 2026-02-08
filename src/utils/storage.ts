// ============================================
// LocalStorage Utilities
// ============================================

/**
 * Type-safe localStorage wrapper
 */
export const storage = {
  /**
   * Get item from localStorage with type safety
   */
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      console.warn(`[Storage] Failed to parse ${key}`);
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[Storage] Failed to save ${key}:`, error);
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  },

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  },

  /**
   * Clear all app-specific storage
   */
  clearAll(prefix = 'dsa-mastery'): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  },
};
