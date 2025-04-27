#!/usr/bin/env node

import { Command } from "commander";
import { execSync } from "node:child_process";
import { generateCommand } from "./lib/generate";
import { notesCommand } from "./lib/releaseNotes";

const program = new Command();

const sha = execSync("git rev-parse HEAD", { encoding: "utf8" });

program
  .name("build-changelog")
  .description("cli tool to generate changelogs")
  .version("1.4.1");

program
  .command("generate")
  .description("generate the changelog")
  .option("--require-changelog", "require that changes have been made to the changelog.")
  .action(() => {
    generateCommand({ sha, prNumber: 1 }, undefined, true);
  });

program
  .command("notes [version]")
  .description("release notes from the archive for the current git tag")
  .action(notesCommand);

program.parse();
