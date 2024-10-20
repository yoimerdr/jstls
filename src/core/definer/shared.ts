import {Keys} from "../../types/core";
import {keys} from "../objects/handlers/properties";
import {each} from "../iterable/each";

export function multiple<T, D>(target: T, descriptors: D, definer: (target: T, key: Keys<D>, descriptor: D[Keys<D>]) => void) {
  each(keys(descriptors), key => definer(target, key, descriptors[key]))
}
