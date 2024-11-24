#!/usr/bin/env node

import { Command } from "commander";
import { exec } from "node:child_process";
import { generateCommand } from "./lib/generate";
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
    action: generateCommand,
  },
  // TODO: `add` command to add a template changelog based on the git branch. (Maybe auto generate.)
  {
    name: "ac",
    description: "add a change",
    action: () => {
      exec("git rev-parse --abbrev-ref HEAD", (err, stdout, _stderr) => {
        if (err) {
          // handle error
        }
        const branch = stdout.trim();
        console.log(`Current branch: ${branch}`);
      });
    },
  },
  // TODO: `realease notes` get the releases notes for the current version to be able to output in the release.
];

const program = new Command();

program
  .name("build-changelog")
  .description("cli tool to generate changelogs")
  .version("0.2.4");

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
