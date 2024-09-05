export interface NumberExtensions {
  /**
   * Restricts the number to be at most the given maximum.
   *
   * @param {number} maximum - The maximum value.
   * @returns {number} The coerced number, which is the smallest of the original number or the maximum.
   */
  coerceAtMost(maximum: number): number

  /**
   * Restricts the number to be at least the given minimum.
   *
   * @param {number} minimum - The minimum value.
   * @returns {number} The coerced number, which is the largest of the original number or the minimum.
   */
  coerceAtLeast(minimum: number): number

  /**
   * Restricts the number to be within the given range [minimum, maximum].
   *
   * @param {number} minimum - The minimum value.
   * @param {number} maximum - The maximum value.
   * @returns {number} The coerced number, which will be within the range [minimum, maximum].
   */
  coerceIn(minimum: number, maximum: number): number

  /**
   * Checks if the number is within the inclusive range [minimum, maximum].
   *
   * @param {number} minimum - The minimum value.
   * @param {number} maximum - The maximum value.
   * @returns {boolean} True if the number is within the inclusive range [minimum, maximum], false otherwise.
   */
  isFromTo(minimum: number, maximum: number): boolean

  /**
   * Checks if the number is within the inclusive-exclusive range [minimum, maximum].
   *
   * @param {number} minimum - The minimum value.
   * @param {number} maximum - The maximum value.
   * @returns {boolean} True if the number is within the inclusive-exclusive range [minimum, maximum], false otherwise.
   */
  isFromUntil(minimum: number, maximum: number): boolean
}

export interface NumberWithExtensions extends Number, NumberExtensions {
}
