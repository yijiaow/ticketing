import { ValidationError } from 'express-validator';

export class RequestValidationException extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    Object.setPrototypeOf(this, RequestValidationException.prototype);
  }
}
