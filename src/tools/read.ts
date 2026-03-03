import { z } from "zod";
import fs from "fs/promises";
import type { Tool, ToolResult } from "./types.js";
import { colors } from "../utils/colors.js";

const inputSchema = z.object({
  file_path: z.string().describe("Absolute path to the file to read"),
  offset: z
    .number()
    .optional()
    .describe("Line number to start reading from (1-based)"),
  limit: z
    .number()
    .optional()
    .describe("Maximum number of lines to read"),
});

export const readTool: Tool = {
  name: "read",
  description:
    "Read a file from the filesystem. Returns the file content with line numbers. Supports optional offset and limit for reading specific portions of large files.",
  inputSchema,

  async call(input): Promise<ToolResult> {
    const { file_path, offset, limit } = inputSchema.parse(input);

    try {
      const content = await fs.readFile(file_path, "utf-8");
      const lines = content.split("\n");

      const startLine = offset ? offset - 1 : 0;
      const endLine = limit ? startLine + limit : lines.length;
      const selectedLines = lines.slice(startLine, endLine);

      const numbered = selectedLines
        .map((line, i) => {
          const lineNum = (startLine + i + 1).toString().padStart(6);
          return `${lineNum}\t${line}`;
        })
        .join("\n");

      return { output: numbered };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { output: `Error reading file: ${message}`, isError: true };
    }
  },

  renderToolCall(input) {
    const { file_path, offset, limit } = inputSchema.parse(input);
    let desc = `${colors.toolName("read")} ${colors.fileName(file_path)}`;
    if (offset || limit) {
      desc += colors.muted(
        ` (${offset ? `from line ${offset}` : ""}${offset && limit ? ", " : ""}${limit ? `limit ${limit}` : ""})`
      );
    }
    return desc;
  },

  renderResult(result) {
    if (result.isError) return colors.error(result.output);
    const lines = result.output.split("\n");
    if (lines.length > 20) {
      return lines.slice(0, 20).join("\n") + `\n${colors.muted(`... (${lines.length - 20} more lines)`)}`;
    }
    return result.output;
  },
};
