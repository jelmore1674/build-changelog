#!/usr/bin/env node

import { Command } from "commander";
import { exec } from "node:child_process";
import { generateCommand } from "./lib/generate";
import { initCommand } from "./lib/init";
import { notesCommand } from "./lib/releaseNotes";

const commands = [
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
];

const program = new Command();

program
  .name("build-changelog")
  .description("cli tool to generate changelogs")
  .version("0.3.3");

program
  .command("init")
  .description("setup project to generate changelogs")
  .action(initCommand);

program
  .command("generate")
  .description("generate the changelog")
  .option("--require-changelog", "require that changes have been made to the changelog.")
  .action(generateCommand);

program
  .command("notes [version]")
  .description("realease notes from the archive for the current git tag")
  .action(notesCommand);

program.parse();
