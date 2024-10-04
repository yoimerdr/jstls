export function matchName(name: string): string {
  const match = name.match(/function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/);
  return match ? match[1].trim() : '';
}

export function name<F extends ((...args: any) => any) | Function>(fn: F): string {
  if ((fn as any).name)
    return (fn as any).name;
  return matchName(fn.toString())
}


