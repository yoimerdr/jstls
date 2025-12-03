/**
 * Extracts the function name from a string representation of a function.
 *
 * @example
 * matchName('function test() {}'); // 'test'
 *
 * @param name The string representation of the function.
 */
export function matchName(name: string): string {
  const match = name.match(/function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/);
  return match ? match[1].trim() : '';
}

/**
 * Gets the name of a function.
 *
 * @example
 * function test() {}
 * name(test); // 'test'
 *
 * @param fn The function to get the name of.
 */
export function name<F extends CallableFunction>(fn: F): string {
  return (fn as any).name || matchName(fn.toString())
}


