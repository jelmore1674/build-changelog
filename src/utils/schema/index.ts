import fs from "node:fs";
import path from "node:path";
import z from "zod";

const simpleChangeEntrySchema = z.array(z.string().describe("Simple Change Entry"))
  .describe("This is a simple change entry");

const breakingChangeEntrySchema = z.object({
  breaking: z.array(z.string().describe("The change entry message"))
    .describe("The change entry messages"),
}).describe("This is a breaking change");

const complexChangeEntrySchema = z.array(z.object({
  message: z.string().describe("The change entry message"),
  flag: z.string().optional().describe("The flag to add a prefix to the changes"),
  references: z.array(z.object({
    type: z.literal(["pull_request", "issue"]).describe(
      "The type of reference, can be `pull_request`,`pr`, or `issue`",
    ),
    number: z.number().describe("The pull request or issue number"),
  })).optional().describe("Issue or Pull Request reference to the change"),
})).describe("A complex change entry");

export const changeEntrySchema = z.union([
  simpleChangeEntrySchema,
  breakingChangeEntrySchema,
  complexChangeEntrySchema,
]);

export const changelogSchema = z.object({
  added: changeEntrySchema.optional().describe("Changes where you add to the project"),
  changed: changeEntrySchema.optional().describe("Changes where you changed functionality"),
  removed: changeEntrySchema.optional().describe(
    "Changes where you removed a feature or something else",
  ),
  fixed: changeEntrySchema.optional().describe("Changes where you fixed a bug"),
  security: changeEntrySchema.optional().describe(
    "Changes where you made an update for security reasons",
  ),
  deprecated: changeEntrySchema.optional().describe(
    "Changes where you plan on removing something, but are waiting to do so",
  ),
  version: z.string().optional().describe(
    "The current version of the project. If left off this will fallback to being `Unreleased`",
  ),
  release_date: z.iso.date().optional()
    .describe(
      "The release date of the current version. If this is property is not defined this will fall back to `TBD`",
    ),
  notice: z.string().optional().describe("A notice for a the current release"),
  change: z.literal(["major", "minor", "patch"]).optional().describe(
    "The type of change you are creating. Valid values are `major` | `minor` | `patch`.",
  ),
});

const json = z.toJSONSchema(
  changelogSchema
    .meta({
      title: "build-changelog",
      description: "Schema for changelog files",
    }),
  {
    reused: "ref",
    metadata: z.globalRegistry,
  },
);

const dir = path.join(process.cwd(), "schemas/changlelog.json");

fs.writeFileSync(dir, `${JSON.stringify(json, null, 4)}\n`);
