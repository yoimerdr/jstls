import {applyArrayExtensions} from "./array";
import {applyStringExtensions} from "./string";
import {applyNumberExtensions} from "./number";

export function applyExtensions(): void {
  applyArrayExtensions();
  applyStringExtensions();
  applyNumberExtensions();
}
