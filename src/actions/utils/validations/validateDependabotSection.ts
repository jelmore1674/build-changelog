function validateDependabotSection(input: string) {
  const validDependabotSection = ["security", "changed"];

  if (validDependabotSection.includes(input)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `Expected one of these inputs: ${validDependabotSection.join(", ")}`,
  };
}

export { validateDependabotSection };
