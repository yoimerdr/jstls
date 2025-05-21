import {applyArrayExtensions} from "./array";
import {applyStringExtensions} from "./string";
import {applyNumberExtensions} from "./numbers";

export function applyExtensions(): void {
  applyArrayExtensions();
  applyStringExtensions();
  applyNumberExtensions();
}
