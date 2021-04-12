import { CustomException } from './customException';

export class NotAuthorizedException extends CustomException {
  statusCode = 401;

  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, NotAuthorizedException.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
