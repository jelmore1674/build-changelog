#!/usr/bin/env node

import { Command } from "commander";
import { exec } from "node:child_process";
import { generateCommand, getChangelogArchive } from "./lib/generate";
import { initCommand } from "./lib/init";
import { generateChangelog, generateReleaseNotes } from "./lib/mustache";
import { rl } from "./lib/readline";
import { notesCommand } from "./lib/releaseNotes";

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
  // TODO: `add` command to add a template changelog based on the git branch. (Maybe auto generate?)
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
  {
    name: "notes [version]",
    description: "realease notes from the archive for the current git tag",
    action: notesCommand,
  },
];

const program = new Command();

program
  .name("build-changelog")
  .description("cli tool to generate changelogs")
  .version("0.3.1");

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
