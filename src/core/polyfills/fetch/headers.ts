import {uid} from "@jstls/core/polyfills/symbol";
import {WithPrototype} from "@jstls/types/core/objects";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {readonly} from "@jstls/core/definer";
import {isArray} from "@jstls/core/shortcuts/array";
import {isDefined, isFunction, isinstance} from "@jstls/core/objects/types";
import {keach} from "@jstls/core/iterable/each";
import {string} from "@jstls/core/objects/handlers";
import {apply} from "@jstls/core/functions/apply";
import {get2} from "@jstls/core/objects/handlers/getset";
import {bind} from "@jstls/core/functions/bind";

const mapKey = uid("m");

export interface HeadersPolyfill {
  append(name: string, value: string): void;

  get(name: string): string | null;

  has(name: string): boolean;

  forEach(callbackfn: (value: string, key: string, parent: HeadersPolyfill) => void, thisArg?: any): void;
}

export interface HeadersConstructor extends WithPrototype<HeadersPolyfill> {
  new(headers: HeadersInit): HeadersPolyfill
}

function setHeaderEach(this: HeadersPolyfill, value: any, key: string) {
  isDefined(value) && this.append(key, string(value))
}

function normalizeName(name: any) {
  return String(name).toLowerCase();
}

function normalizeValue(value: any) {
  return String(value);
}

export const HeadersPolyfill: HeadersConstructor = funclass2({
  construct: function (headers) {
    const map = {},
      $this = this;
    if (headers) {
      if (isArray(headers)) {
        (headers as Array<[string, string]>).forEach(function (value) {
          apply(setHeaderEach, $this, value)
        })
      } else if (isinstance(headers, HeadersPolyfill)) {
        (headers as HeadersPolyfill).forEach(setHeaderEach, $this);
      } else keach(headers, setHeaderEach, $this)
    }
    readonly(this, mapKey, map);
  },
  prototype: {
    append(name, value) {
      name = normalizeName(name);
      value = normalizeValue(value);
      const map = get2(this, mapKey)
      map[name] = value;
    },
    get(name) {
      const map = get2(this, mapKey),
        values = map[normalizeName(name)];
      return values ? values[0] : null;
    },
    has(name) {
      return !!get2(this, mapKey)[normalizeName(name)];
    },
    forEach(callbackfn, thisArg) {
      const $this = this,
        map = get2($this, mapKey);
      if (!isFunction(callbackfn))
        return;

      callbackfn = bind(callbackfn, thisArg);
      keach(map, function (value, key, ) {
        callbackfn(value, key as string, $this)
      });
    }
  }
})
