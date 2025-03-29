import { generateCommand } from "../lib/generate";
import { getAuthorName } from "./utils/getAuthorName";
import { getPrNumber } from "./utils/getPrNumber";

async function generateChangelogAction() {
  const author = await getAuthorName();
  const prNumber = await getPrNumber();
  generateCommand(author, prNumber);
}

export { generateChangelogAction };
