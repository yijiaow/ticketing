export class DatabaseConnectionException extends Error {
  reason = 'Error connecting to database';

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionException.prototype);
  }
}
