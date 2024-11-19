/**
 * reimplementation of `console.log` this way we can keep out test environment
 * clean.
 *
 * @param message what you want to log
 */
function log(message: string) {
  if (process.env.NODE_ENV !== "test") {
    console.log(message);
  }
}

export { log };
