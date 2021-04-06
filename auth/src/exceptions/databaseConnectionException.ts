import { CustomException } from './customException';

export class DatabaseConnectionException extends CustomException {
  statusCode = 500;
  reason = 'Error connecting to database';

  constructor() {
    super('Error connecting to database');

    Object.setPrototypeOf(this, DatabaseConnectionException.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
