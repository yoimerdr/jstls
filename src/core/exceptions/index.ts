export class IllegalAccessError extends Error {
  name = 'IllegalAccessError';
  constructor(message: string) {
    super(message)
  }
}

export class IllegalArgumentError extends Error {
  name = 'IllegalArgumentError';
  constructor(message: string) {
    super(message);
  }
}

export class RequiredArgumentError extends IllegalArgumentError {
  name = 'RequiredArgumentError';
  constructor(message: string) {
    super(message);
  }
}
