/**
 * Util used to capitalize first letter of a string.
 *
 * @params str - the string to caplitalize.
 */
function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export { capitalizeFirstLetter };
