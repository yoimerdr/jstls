export function matchName(name: string): string {
  const match = name.match(/function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/);
  return match ? match[1].trim() : '';
}

export function name<F extends CallableFunction>(fn: F): string {
  return (fn as any).name || matchName(fn.toString())
}


