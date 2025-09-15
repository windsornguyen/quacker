/*--------------------------------------------------------------------*/
/* Quacker (Quad + Tracker)                                           */
/* Author: Windsor Nguyen '25                                         */
/*--------------------------------------------------------------------*/

/**
 * In-memory storage for count.
 * This will reset when the server restarts, but provides
 * concurrent-safe operations for multiple clients.
 */
class CountStorage {
  private count: number = 0;

  /**
   * Get the current count value.
   * @return {number} The current count.
   */
  getCount(): number {
    return this.count;
  }

  /**
   * Increment the count by a specified value.
   * @param {number} value - The amount to increment by.
   * @return {number} The new count after incrementing.
   */
  increment(value: number): number {
    this.count += value;
    return this.count;
  }

  /**
   * Decrement the count by a specified value.
   * Ensures count never goes below zero.
   * @param {number} value - The amount to decrement by.
   * @return {number} The new count after decrementing.
   */
  decrement(value: number): number {
    this.count = Math.max(0, this.count - value);
    return this.count;
  }

  /**
   * Reset the count to zero.
   * @return {number} The reset count (0).
   */
  reset(): number {
    this.count = 0;
    return this.count;
  }
}

// Singleton storage instance shared across the entire application
export const storage = new CountStorage();
