import { getInput } from "@actions/core";
import { log } from "@utils/log";
import { exit } from "node:process";

/**
 * Helper function used to validate inputs that have specific requirements.
 *
 * @param input - The action input.
 * @param validationFunction - The function used to validate the input.
 * @param [options={ required: false }] - The options to pass to getInput.
 *
 * @example
 * ```ts
 * function validateChangelogStyles(input: string) {
 *    const validChangelogStyles = ['keep-a-changelog','common-changelog', 'custom'];
 *
 *    if (validateChangelogStyles.includes(input)) {
 *      return { isValid: true }
 *    }
 *
 *    return { isValid: false, error: `Expected one of the following values "${validateChangelogStyles.join(", ")}"`}
 * }
 *
 * const changelogStyles = validateInput("changelog_styles",validateChangelogStyles);
 * ```
 */
function validateInput<T = string>(
  input: string,
  validationFunction: (input: string) => { isValid: boolean; error?: string },
  options = { required: false },
) {
  const actionInput = getInput(input, options);

  if (actionInput) {
    const { error } = validationFunction(actionInput);

    if (error) {
      log(`The input "${input}" is not valid.\n\n${error}`);
      exit(1);
    }
  }

  return actionInput as T;
}

export { validateInput };
