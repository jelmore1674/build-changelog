import { enforceChangelogAction } from "./actions/enforcer";

try {
  enforceChangelogAction();
} catch (e) {
  console.info({ e });
}
