import { CustomException } from './customException';

export class NotFoundException extends CustomException {
  statusCode = 404;
  reason = 'Page not found';

  constructor() {
    super('Page not found');

    Object.setPrototypeOf(this, NotFoundException.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
