import { CustomException } from './customException';

export class BadRequestException extends CustomException {
  statusCode = 400;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestException.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
