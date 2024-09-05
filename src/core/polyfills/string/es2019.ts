export function trimStart(this: string): string {
  return this.replace(/^[\s\uFEFF\xA0]+/, '');
}

export function trimEnd(this: string): string {
  return this.replace(/[\s\uFEFF\xA0]+$/, '');
}
