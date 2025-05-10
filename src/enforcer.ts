import { getState } from "@actions/core";
import { enforceChangelogAction } from "./actions/enforcer";

const isPost = !!getState("isPost");

if (!isPost) {
  enforceChangelogAction();
} else {
  console.info("hi");
}
