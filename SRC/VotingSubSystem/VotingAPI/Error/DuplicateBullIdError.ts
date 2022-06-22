export class DuplicateBullIdError extends Error {
  constructor() {
    super(
      "Too many requests in a short time for the same Election and voter."
    );
  }
}
