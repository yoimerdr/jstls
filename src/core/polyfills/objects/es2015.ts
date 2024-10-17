export function is<T = any, U = T>(value1: T, value2: U): boolean;
export function is(value1: any, value2: any): boolean {
  if (value1 === value2)
    return value1 !== 0 || 1 / value1 === 1 / value2
  return value1 !== value1 && value2 !== value2
}
