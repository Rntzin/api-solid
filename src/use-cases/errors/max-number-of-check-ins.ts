export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super("Max umber of check-ins reached.");
  }
}
