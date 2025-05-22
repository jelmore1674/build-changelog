import type { KeepAChangelogKeywords } from "@jelmore1674/changelog";
import { type Changes, ComplexChange } from "@types";
import { existsSync, readFileSync } from "node:fs";
import { string, z } from "zod";
import { getParser } from "../getParser";

/**
 * Parse the changes from a `yaml` or `toml` file.
 *
 * @param file - the file you are getting the changes from.
 */
function parseChanges(file: string) {
  const referenceSchema = z.object({
    type: z.enum(["pull_request", "issue"]),
    number: z.number(),
  });

  const changeSchema = z.array(z.string()).or(z.record(z.string(), z.array(z.string()))).or(
    z.array(z.object({
      flag: z.string().optional(),
      message: z.string(),
      references: z.array(referenceSchema),
    })),
  );
  if (existsSync(file)) {
    const parser = getParser(file);
    const schema = z.object({
      version: z.string().optional(),
      notice: z.string().optional(),
      release_date: z.string().optional(),
      author: z.string().optional(),
      added: changeSchema.optional(),
      changed: changeSchema.optional(),
      deprecated: changeSchema.optional(),
      fixed: changeSchema.optional(),
      removed: changeSchema.optional(),
      security: changeSchema.optional(),
      change: z.enum(["major", "minor", "patch"]).default("patch"),
      references: z.array(referenceSchema).optional(),
    });
    const fileData = parser.parse(readFileSync(file, { encoding: "utf8" }));

    return schema.parse(fileData);

    // return parser.parse(readFileSync(file, { encoding: "utf8" })) as unknown as T;
  }

  throw new Error(`The file does not exist\n\n${file}`);
}

export { parseChanges };
