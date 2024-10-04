import {Maybe} from "../../types/core";
import {isEmpty, isNotEmpty} from "../extensions/shared/iterables";
import {string} from "../objects/handlers";
import {isDefined} from "../objects/types";
import {IllegalArgumentError} from "../exceptions";
import {readonlys} from "../definer";
import {slice} from "../iterable";
import {apply} from "../functions/apply";
import {each, reach} from "../iterable/each";
import {filter} from "../iterable/filter";

export const sep = '/';

function pathSuffix(this: Path, start?: number): string {
  const name = this.name();
  const dot = name.lastIndexOf('.');
  const end = isDefined(start) ? dot : name.length;
  if (!isDefined(start))
    start = dot;
  return dot === -1 ? "" : name.substring(start!, end);
}


function fromNormalizedParts(parts: string[], path?: Maybe<Path>): Path {
  const root: Path = isDefined(path) ? path! : Object.create(Path.prototype);
  path = root;
  reach(parts, (value, index) => {
    readonlys(path, {
      __name__: value,
      __parent__: index === 0 ? null : Object.create(Path.prototype)
    });
    path = path!.parent()
  })

  return root;
}

export class Path {
  protected readonly __name__!: string;
  protected readonly __parent__: Maybe<Path>;

  constructor(path: string | Path) {
    const parts = path instanceof Path ? path.parts() : normalize(path)
      .split(sep);
    if (apply(isEmpty, parts))
      throw new IllegalArgumentError('The normalized path cannot be empty.');
    return fromNormalizedParts(parts, this);
  }

  parts(): string[] {
    const parts: string[] = [this.name()];
    let parent = this.parent();
    while (parent) {
      parts[parts.length] = parent!.name();
      parent = parent!.parent();
    }
    parts.reverse();
    return parts;
  }

  parent(): Maybe<Path> {
    return this.__parent__;
  }

  name(): string {
    return this.__name__;
  }

  prefix(): string {
    return apply(pathSuffix, this, [0]);
  }

  path(): string {
    return this.parts()
      .join(sep)
  }

  suffix(): string {
    return apply(pathSuffix, this, [])
  }

  withSuffix(suffix: string): Path {
    if (apply(isEmpty, suffix) || suffix === "." || suffix[0] !== "." || /[\\/]/g.test(suffix))
      throw new IllegalArgumentError("[Path] Invalid suffix: " + suffix)
    const parts = this.parts();
    parts[parts.length - 1] = this.prefix() + suffix;
    return fromNormalizedParts(parts);
  }

  join(path: string | Path, ...args: Array<string | Path>): Path;
  join(): Path {
    return apply(pathOf, null, this.parts().concat(slice(arguments)) as any)
  }

  toString(): string {
    return this.path();
  }
}

export function normalize(path: string): string {
  path = string(path).trim();
  if (apply(isEmpty, path))
    return '';

  const parts = path.split(/[/\\]+/g);
  if (apply(isEmpty, parts))
    return '';

  let stack: string[] = [];

  each(
    parts.map(part => part.trim())
      .filter(part => {
        return apply(isNotEmpty, part) && part !== '.';
      }),
    part => {
      if (part === '..') {
        if (apply(isNotEmpty, stack))
          stack.pop();
      } else stack[stack.length] = part;
    })


  if (apply(isEmpty, stack))
    return '';

  return (apply(isEmpty, stack[0]) ? sep : '') + stack.join(sep)
}


export function join(path: Object, ...paths: Object[]): string;

export function join(): string {
  return normalize(
    filter(arguments, isDefined)
      .join(sep)
  )
}

export function pathOf(path: Object, ...paths: Object[]): Path;
export function pathOf(): Path {
  return fromNormalizedParts(
    apply(join, null, slice(arguments) as any)
      .split(sep)
  )
}
