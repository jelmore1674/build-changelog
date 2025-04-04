/**
 * reimplementation of `console.log` this way we can keep out test environment
 * clean.
 *
 * @param message what you want to log
 * @param optionalParams anything else the user may want to add.
 */
function log(message: unknown, ...optionalParams: unknown[]) {
  if (process.env.NODE_ENV !== "test") {
    console.info(message, ...optionalParams);
  }
}

export { log };
