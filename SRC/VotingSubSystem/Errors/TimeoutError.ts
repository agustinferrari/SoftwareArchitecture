export class TimeoutError extends Error {
  constructor() {
    super("Your request could not be processed in the expected time, please try again");
  }
}
