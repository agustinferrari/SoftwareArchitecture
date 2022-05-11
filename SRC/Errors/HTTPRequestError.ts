export class HTTPRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HTTPRequestError";
  }
}
