export abstract class CustomException extends Error {
  abstract statusCode: number;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomException.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
