function validateReleaseTypes(input: string) {
  const validReleaseTypes = ["patch", "minor", "major"];

  if (validReleaseTypes.includes(input)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `Expected on of the following inputs: ${validReleaseTypes.join(", ")}`,
  };
}

export { validateReleaseTypes };
