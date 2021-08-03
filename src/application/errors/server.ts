export class ServerError extends Error {
  constructor(error?: Error) {
    super('Internal Server Error. Please, try again soon.');
    this.name = 'ServerError';
    this.stack = error?.stack;
  }
}
