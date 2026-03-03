import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import type { Tool, ToolResult } from "./types.js";
import { colors } from "../utils/colors.js";

const inputSchema = z.object({
  file_path: z.string().describe("Absolute path to the file to write"),
  content: z.string().describe("The content to write to the file"),
});

export const writeTool: Tool = {
  name: "write",
  description:
    "Write content to a file. Creates the file and any parent directories if they don't exist. Overwrites existing files.",
  inputSchema,

  async call(input): Promise<ToolResult> {
    const { file_path, content } = inputSchema.parse(input);

    try {
      await fs.mkdir(path.dirname(file_path), { recursive: true });
      await fs.writeFile(file_path, content, "utf-8");

      const lines = content.split("\n").length;
      return {
        output: `Successfully wrote ${lines} lines to ${file_path}`,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { output: `Error writing file: ${message}`, isError: true };
    }
  },

  renderToolCall(input) {
    const { file_path, content } = inputSchema.parse(input);
    const lines = content.split("\n").length;
    return `${colors.toolName("write")} ${colors.fileName(file_path)} ${colors.muted(`(${lines} lines)`)}`;
  },

  renderResult(result) {
    if (result.isError) return colors.error(result.output);
    return colors.success(result.output);
  },
};
