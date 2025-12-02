import {Maybe} from "@jstls/types/core";
import {isEmpty, isNotEmpty} from "@jstls/core/extensions/shared/iterables";
import {isDefined} from "@jstls/core/objects/types";
import {IllegalArgumentError} from "@jstls/core/exceptions/illegal-argument";
import {writeable} from "@jstls/core/definer";
import {slice} from "@jstls/core/iterable";
import {apply} from "@jstls/core/functions/apply";
import {reach} from "@jstls/core/iterable/each";
import {filter} from "@jstls/core/iterable/filter";
import {uid} from "@jstls/core/polyfills/symbol";
import {WithPrototype} from "@jstls/types/core/objects";
import {set} from "@jstls/core/objects/handlers/getset";
import {string} from "@jstls/core/objects/handlers";
import {create, prototype} from "@jstls/core/shortcuts/object";
import {concat, len} from "@jstls/core/shortcuts/indexable";
import {forEach} from "@jstls/core/shortcuts/array";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {descriptor2} from "@jstls/core/definer/shared";
import {PropertyDescriptors} from "@jstls/types/core/objects/definer";
import {mapped, simple} from "@jstls/core/definer/getters/builders";
import {nullable} from "./types";
import {partial} from "@jstls/core/functions/partial";

/**
 * Path separator
 * */
export const sep = '/';

const pathName = uid("mN"),
  pathParent = uid("mP");

function pathSuffix($this: Path, start?: number): string {
  const name = $this.name,
    dot = name.lastIndexOf('.'),
    end = isDefined(start) ? dot : len(name);
  isDefined(start) || (start = dot);
  return dot === -1 ? "" : name.substring(start!, end);
}

function fromNormalizedParts(parts: string[], path?: Maybe<Path>): Path {
  const p = path ? path :  prototype(Path),
    root: Path = isDefined(path) ? path! : create(p);
  path = root;
  reach(parts, (value, index) => {
    writeable(path, pathName, value);
    writeable(path, pathParent, index === 0 ? nullable : create(p));
    path = path!.parent
  })

  return root;
}


export interface Path {
  /**
   * Parent path segment
   * */
  parent: Maybe<Path>;

  /**
   * Name of the current path segment
   * */
  name: string;

  /**
   * File name prefix (before extension)
   * */
  readonly prefix: string;

  /**
   * Full normalized path string
   * */
  readonly path: string;

  /**
   * File extension
   * */
  readonly suffix: string;

  /**
   * Array of path segments
   * */
  readonly parts: string[];

  /**
   * Creates a new path with a different suffix
   * @param suffix New suffix to apply
   * @returns New path with updated suffix
   */
  withSuffix(suffix: string): Path;

  /**
   * Joins this path with additional path segments
   * @param path Path to join
   * @param paths Additional path segments
   * @returns New combined path
   */
  join(path: string | Path, ...paths: Array<string | Path>): Path;

  /**
   * Converts path to string representation
   * @see {path}
   */
  toString(): string;
}


export interface PathConstructor extends WithPrototype<Path> {
  new(path: string | Path): Path;
}

/**
 * Simple path class implementation for handling file paths
 */
export const Path: PathConstructor = funclass2({
  construct: function (path) {
    const parts = path instanceof Path ? path.parts : normalize(path)
      .split(sep);

    if (isEmpty(parts))
      throw new IllegalArgumentError('The normalized path cannot be empty.');

    return fromNormalizedParts(parts, this);
  },
  prototype: {
    withSuffix(suffix) {
      if (isEmpty(suffix) || suffix === "." || suffix[0] !== "." || /[\\/]/g.test(suffix))
        throw new IllegalArgumentError("Invalid suffix: " + suffix)
      const $this = this,
        parts = $this.parts;
      parts[len(parts) - 1] = $this.prefix + suffix;
      return fromNormalizedParts(parts);
    },
    join() {
      return apply(pathOf, nullable, <any> concat(this.parts, slice(arguments)));
    },
    toString: partial(simple<Path>, 'path')
  },
  protodescriptor: <Partial<PropertyDescriptors<Path>>>{
    name: descriptor2<Path>(partial(simple, pathName), function (name: string) {
      name = string(name);
      if (isEmpty(name) || name === "." /*others path name validations*/)
        throw new IllegalArgumentError("Invalid path name.")
      set(this, pathName, name);
    }),
    parent: descriptor2<Path>(partial(simple, pathParent), function (parent) {
      if (!parent || !(parent instanceof Path))
        throw new IllegalArgumentError("Invalid parent path");

      set(this, pathParent, parent);
    }),
    prefix: descriptor2<Path>(function () {
      return pathSuffix(this, 0);
    }),
    path: descriptor2<Path>(function () {
      return this.parts
        .join(sep);
    }),
    suffix: descriptor2<Path>(partial(mapped<any>, nullable!, pathSuffix)),
    parts: descriptor2<Path>(function () {
      const $this = this,
        parts = [$this.name];
      let parent = $this.parent;
      while (parent) {
        parts[len(parts)] = parent.name;
        parent = parent.parent;
      }
      return parts.reverse();
    })
  }
})

/**
 * Normalizes a path string by resolving `.` and `..` segments
 * @param path Path to normalize
 * @returns Normalized path string
 */
export function normalize(path: string): string {
  path = string(path).trim();
  if (isEmpty(path))
    return '';

  const parts = path.split(/[/\\]+/g);
  if (isEmpty(parts))
    return '';

  let stack: string[] = [];
  forEach(
    parts.map(part => part.trim())
      .filter(part => isNotEmpty(part) && part !== '.'),
    part => {
      if (part === '..') {
        isNotEmpty(stack) && stack.pop();
      } else stack[len(stack)] = part;
    })


  if (isEmpty(stack))
    return '';

  return (isEmpty(stack[0]) ? sep : '') + stack.join(sep)
}

/**
 * Joins path segments together and normalizes the result
 * @param path First path segment
 * @param paths Additional path segments
 * @returns Joined and normalized path string
 */
export function join(path: Object, ...paths: Object[]): string;

export function join(): string {
  return normalize(
    filter(arguments, isDefined)
      .join(sep)
  )
}

/**
 * Creates a Path object from path segments
 * @param path First path segment
 * @param paths Additional path segments
 * @returns New Path object
 */
export function pathOf(path: Object, ...paths: Object[]): Path;
export function pathOf(): Path {
  return fromNormalizedParts(
    apply(join, nullable, <any> slice(arguments))
      .split(sep)
  )
}
