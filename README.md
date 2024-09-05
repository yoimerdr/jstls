# jstls

This repository contains a collection of TypeScript utilities, extensions, and helper functions to enhance TypeScript development. It aims to simplify common tasks, improve code readability.

## Key Features

1. **Core Types**: Extended TypeScript types for improved type safety and flexibility.
2. **Iterables**: Advanced iteration utilities, including custom `Iter` and `IterMatch` classes.
3. **Object Handling**: Utilities for object manipulation, property definition, and type checking.
4. **Extensions**: Extends built-in types like `Number`, `String`, and `Array` with additional functionality.
5. **Geometry**: Includes `Size` and `SizeInt` classes for handling dimensions and aspect ratios.
6. **Polyfills**: Implements polyfills for newer JavaScript features to ensure compatibility.
7. **Functional Programming**: Provides utilities for functional programming patterns.
8. **Type Checking**: Robust type checking functions for various data types.
9. **Error Handling**: Custom error classes for more specific error handling.
10. **Method Extension**: Utilities for extending and modifying existing object methods.

## Usage Examples

### Using the Size class

```typescript
import { Size } from './jstls/src/core/geometry/size';

const size = Size.parse("1920:1080");
console.log(size.toString()); // Size { width: 1920, height: 1080 }

const scaledSize = size.scale("800:600");
console.log(scaledSize.toString()); // Size { width: 800, height: 450 }
```

### Working with Iterables

```typescript
import { iter } from './jstls/src/core/iterable/iter';

const numbers = [1, 2, 3, 4, 5];
iter(numbers).each(num => console.log(num));

const doubledNumbers = iter(numbers).map(num => num * 2).toArray();
console.log(doubledNumbers); // [2, 4, 6, 8, 10]
```

### Object Property Definition

```typescript
import { readonly, writeable } from './jstls/src/core/definer';

const obj = {};
readonly(obj, 'immutableKey', 'value');
writeable(obj, 'mutableKey', 'value');

console.log(obj.immutableKey); // 'value'
obj.mutableKey = 'new value';
console.log(obj.mutableKey); // 'new value'
```

### Number Extensions

```typescript
import { applyNumberExtensions } from './jstls/src/core/extensions/number';

applyNumberExtensions();

const num = 5;
console.log(num.coerceAtLeast(10)); // 10
console.log(num.coerceAtMost(3)); // 3
console.log(num.coerceIn(2, 8)); // 5
```

### String Extensions

```typescript
import { applyStringExtensions } from './jstls/src/core/extensions/string';

applyStringExtensions();

const str = "  Hello, World!  ";
console.log(str.toInt()); // null
console.log("42".toInt()); // 42
```

### Array Extensions

```typescript
import { applyArrayExtensions } from './jstls/src/core/extensions/array';

applyArrayExtensions();

const arr = [1, 2, 3, undefined, 4, 5];
console.log(arr.first()); // 1
console.log(arr.last()); // 5
console.log(arr.isEmpty()); // false
console.log(arr.filterDefined()); // [1, 2, 3, 4, 5]
```

## Documentation

For detailed documentation, check on the files.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
