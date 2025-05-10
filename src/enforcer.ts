import { getState, saveState } from "@actions/core";
import { enforceChangelogAction } from "./actions/enforcer";

process.env.FORCE_COLOR = "2";

const isPost = !!getState("isPost");

// Publish a variable so that when the POST action runs, it can determine it should run the cleanup logic.
// This is necessary since we don't have a separate entry point.
if (!isPost) {
  saveState("isPost", "true");
}

if (!isPost) {
  enforceChangelogAction();
} else {
  console.info("hi");
}
