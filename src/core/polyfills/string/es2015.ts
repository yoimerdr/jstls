import {MaybeNumber} from "../../../types/core";

export function endsWith(this: string, searchString: string, endPosition?: number): boolean {
  endPosition = ((endPosition! >> 0) || this.length) - searchString.length;
  const index = this.lastIndexOf(searchString, endPosition);
  return index !== -1 && index === endPosition;
}

export function startsWith(this: string, searchString: string, position?: number): boolean {
  position = position! >> 0;
  return this.indexOf(searchString, position) === position;
}

export function repeat(this: string, count: number): string {
  count = count >> 0;
  if(this.length === 0 || count === 0)
    return '';
  if(count === 1)
    return this;
  if (count < 0)
    throw new RangeError("Repeat count must be non-negative")
  else if (count === Infinity)
    throw new RangeError('Repeat count must be less than infinity');
  count = Math.floor(count)

  if (this.length * count >= 1 << 28)
    throw new RangeError('Repeat count must not overflow maximum string size');

  let str = this;
  --count;
  while(count) {
    str += this;
    --count;
  }

  return str;
}


export function codePointAt(this: string, position: number): MaybeNumber {
  if(this.length === 0)
    return undefined;
  position = position >> 0;
  const code = this.charCodeAt(position);
  if (code >= 0xD800 && code <= 0xDBFF && this.length > position + 1) {
    const second = this.charCodeAt(position + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      return (code - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return code;
}
