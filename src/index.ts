#!/usr/bin/env node

import { Command } from "commander";
import { createChangelog } from "./lib/generate";
import { initCommand } from "./lib/init";

const commands = [
  {
    name: "init",
    description: "setup project to generate changelogs",
    action: initCommand,
  },
  {
    name: "generate",
    description: "generate the changelog",
    alias: "changelog",
    action: createChangelog,
  },
];

const program = new Command();

program
  .name("build-changelog")
  .description("cli tool to generate changelogs")
  .version("0.0.8");

for (const command of commands) {
  // This is to keep the changelog command alive. for now. Will be deprecated in the future.
  if (command.alias) {
    program
      .command(command.name)
      .description(command.description)
      .action(command.action)
      .alias(command.alias);
  } else {
    program
      .command(command.name)
      .description(command.description)
      .action(command.action);
  }
}

program.parse();
