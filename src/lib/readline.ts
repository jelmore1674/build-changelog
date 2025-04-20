import readline from "node:readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function prompt(question: string, expectedResponse?: string[]) {
  const response = await rl.question(question);

  if (expectedResponse) {
    if (response === "") {
      return expectedResponse[0];
    }

    if (!expectedResponse.includes(response)) {
      console.error(
        `You must enter one of the following respones (${expectedResponse.join(", ")})`,
      );
      return await prompt(question, expectedResponse);
    }
  }

  return response;
}

export { prompt, rl };
