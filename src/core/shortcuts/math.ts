interface RangeShortcut {
  (...values: number[]): number;
}

interface SingleShortcut {
  (x: number): number;
}

interface DuoShortcut {
  (x: number, y: number): number;
}

const M = Math,

/**
 * Returns the larger of a set of supplied numeric expressions.
 *
 * This is a short for {@link Math.max}.
 * @param values Numeric expressions to be evaluated.
 * @see {Math.max}
 */
max: RangeShortcut = M.max,

/**
 * Returns the smaller of a set of supplied numeric expressions.
 *
 * This is a short for {@link Math.min}.
 * @param values Numeric expressions to be evaluated.
 * @see {Math.min}
 */
min: RangeShortcut = M.min,

/**
 * Returns the greatest integer less than or equal to its numeric argument.
 *
 * This is a short for {@link Math.floor}.
 * @param x A numeric expression.
 * @see {Math.floor}
 */
floor: SingleShortcut = M.floor,

/**
 * Returns the smallest integer greater than or equal to its numeric argument.
 *
 * This is a short for {@link Math.ceil}.
 * @param x A numeric expression.
 * @see {Math.ceil}
 */
ceil: SingleShortcut = M.ceil,
/**
 * Returns a supplied numeric expression rounded to the nearest integer.
 *
 * This is a short for {@link Math.round}.
 * @param x The value to be rounded to the nearest integer.
 * @see {Math.round}
 */
round: SingleShortcut = M.round,
/**
 * Returns the square root of a number.
 *
 * This is a short for {@link Math.sqrt}.
 * @param x A numeric expression.
 * @see {Math.sqrt}
 */
sqrt: SingleShortcut = M.sqrt,
/**
 * Returns the value of a base expression taken to a specified power.
 *
 * This is a short for {@link Math.pow}.
 * @param x The base value of the expression.
 * @param y The exponent value of the expression.
 * @see {Math.pow}
 */
pow: DuoShortcut = M.pow,
/**
 * Returns a pseudorandom number between 0 and 1.
 *
 * This is a short for {@link Math.random}.
 * @see {Math.random}
 */
random = M.random,
abs = M.abs;

export {
  max,
  min,
  floor,
  ceil,
  round,
  sqrt,
  pow,
  random,
  abs
}
