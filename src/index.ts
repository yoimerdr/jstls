import {KeyableObject} from "@jstls/types/core/objects";
import {configurable, configurable2, readonly, readonly2, writeable, writeable2} from "@jstls/core/definer";

const sample: KeyableObject = {}

readonly(sample, 'a', 1)
readonly2(sample, 'b', 1)
configurable(sample, 'c', 1)
configurable2(sample, 'd', 1)
writeable(sample, 'e', 1)
writeable2(sample, 'f', 1)

console.log(sample)
