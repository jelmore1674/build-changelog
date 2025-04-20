function validateChangelogStyle(input: string) {
  const validChangelogStyle = ["keep-a-changelog", "common-changelog", "custom"];

  if (validChangelogStyle.includes(input)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `Expected on of the following inputs: ${validChangelogStyle.join(", ")}`,
  };
}

export { validateChangelogStyle };
