import { z } from "zod";
import { glob } from "glob";
import type { Tool, ToolResult } from "./types.js";
import { colors } from "../utils/colors.js";

const inputSchema = z.object({
  pattern: z.string().describe("The glob pattern to match files against"),
  path: z
    .string()
    .optional()
    .describe("Directory to search in (defaults to cwd)"),
});

export const globTool: Tool = {
  name: "glob",
  description:
    "Find files matching a glob pattern. Returns matching file paths sorted alphabetically. Useful for discovering files by name or extension.",
  inputSchema,

  async call(input): Promise<ToolResult> {
    const { pattern, path: searchPath } = inputSchema.parse(input);

    try {
      const files = await glob(pattern, {
        cwd: searchPath || process.cwd(),
        absolute: true,
        nodir: true,
      });

      files.sort();

      if (files.length === 0) {
        return { output: "No files matched the pattern." };
      }

      return { output: files.join("\n") };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { output: `Error: ${message}`, isError: true };
    }
  },

  renderToolCall(input) {
    const { pattern, path: searchPath } = inputSchema.parse(input);
    let desc = `${colors.toolName("glob")} ${colors.fileName(pattern)}`;
    if (searchPath) desc += colors.muted(` in ${searchPath}`);
    return desc;
  },

  renderResult(result) {
    if (result.isError) return colors.error(result.output);
    const files = result.output.split("\n");
    if (files.length > 20) {
      return files.slice(0, 20).join("\n") + `\n${colors.muted(`... (${files.length - 20} more files)`)}`;
    }
    return result.output;
  },
};
