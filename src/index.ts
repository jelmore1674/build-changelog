#!/usr/bin/env node

import { Command } from "commander";
import { generateCommand } from "./lib/generate";
import { initCommand } from "./lib/init";
import { notesCommand } from "./lib/releaseNotes";

const program = new Command();

program
  .name("build-changelog")
  .description("cli tool to generate changelogs")
  .version("1.0.0");

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
