import {MaybeNumber} from "@jstls/types/core";
import {floor} from "@jstls/core/shortcuts/math";
import {len} from "@jstls/core/shortcuts/indexable";
import {indefinite} from "@jstls/core/utils/types";

export function endsWith(this: string, searchString: string, endPosition?: number): boolean {
  const $this = this;
  endPosition = ((endPosition! >> 0) || len($this)) - len(searchString);
  const index = $this.lastIndexOf(searchString, endPosition);
  return index !== -1 && index === endPosition;
}

export function startsWith(this: string, searchString: string, position?: number): boolean {
  position = position! >> 0;
  return this.indexOf(searchString, position) === position;
}

export function repeat(this: string, count: number): string {
  count = count >> 0;
  const $this = this,
    Exception = RangeError;

  if(len($this) === 0 || count === 0)
    return '';
  if(count === 1)
    return $this;
  if (count < 0)
    throw new Exception("Repeat count must be non-negative")
  else if (count === Infinity)
    throw new Exception('Repeat count must be less than infinity');
  count = floor(count)

  if (len($this) * count >= 1 << 28)
    throw new Exception('Repeat count must not overflow maximum string size');

  let str = $this;
  --count;
  while(count) {
    str += $this;
    --count;
  }

  return str;
}


export function codePointAt(this: string, position: number): MaybeNumber {
  const $this = this;
  if(len($this) === 0)
    return indefinite;
  position = position >> 0;
  const code = $this.charCodeAt(position);
  if (code >= 0xD800 && code <= 0xDBFF && len($this) > position + 1) {
    const second = $this.charCodeAt(position + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      return (code - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return code;
}
