import {MaybeNumber} from "../index";

export interface StringExtensions {
  /**
   * Checks if the string is empty
   * @returns {boolean} true if string is empty; otherwise false
   */
  isEmpty(): boolean;

  /**
   * Checks if the string is not empty
   * @returns {boolean} true if string is not empty; otherwise false
   */
  isNotEmpty(): boolean;

  toInt(radix?: number): MaybeNumber;
  toFloat(): MaybeNumber;
}

export interface StringWithExtensions extends String, StringExtensions {
}
