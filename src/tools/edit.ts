import { z } from "zod";
import fs from "fs/promises";
import type { Tool, ToolResult } from "./types.js";
import { colors } from "../utils/colors.js";

const inputSchema = z.object({
  file_path: z.string().describe("Absolute path to the file to edit"),
  old_string: z.string().describe("The exact string to find and replace"),
  new_string: z.string().describe("The replacement string"),
  replace_all: z
    .boolean()
    .optional()
    .default(false)
    .describe("Replace all occurrences (default: false)"),
});

export const editTool: Tool = {
  name: "edit",
  description:
    "Edit a file by replacing an exact string match with new content. The old_string must match exactly (including whitespace and indentation). Fails if old_string is not found or matches multiple times (unless replace_all is true).",
  inputSchema,

  async call(input): Promise<ToolResult> {
    const { file_path, old_string, new_string, replace_all } =
      inputSchema.parse(input);

    try {
      const content = await fs.readFile(file_path, "utf-8");

      if (old_string === new_string) {
        return {
          output: "Error: old_string and new_string are identical",
          isError: true,
        };
      }

      if (!content.includes(old_string)) {
        return {
          output: `Error: old_string not found in ${file_path}`,
          isError: true,
        };
      }

      if (!replace_all) {
        const firstIdx = content.indexOf(old_string);
        const secondIdx = content.indexOf(old_string, firstIdx + 1);
        if (secondIdx !== -1) {
          return {
            output: `Error: old_string matches multiple locations in ${file_path}. Use replace_all or provide more context to make the match unique.`,
            isError: true,
          };
        }
      }

      const newContent = replace_all
        ? content.split(old_string).join(new_string)
        : content.replace(old_string, new_string);

      await fs.writeFile(file_path, newContent, "utf-8");

      return {
        output: `Successfully edited ${file_path}`,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { output: `Error editing file: ${message}`, isError: true };
    }
  },

  renderToolCall(input) {
    const { file_path, old_string, new_string } = inputSchema.parse(input);
    const oldPreview =
      old_string.length > 40
        ? old_string.substring(0, 40) + "..."
        : old_string;
    const newPreview =
      new_string.length > 40
        ? new_string.substring(0, 40) + "..."
        : new_string;
    return `${colors.toolName("edit")} ${colors.fileName(file_path)}\n  ${colors.error("- " + oldPreview)}\n  ${colors.success("+ " + newPreview)}`;
  },

  renderResult(result) {
    if (result.isError) return colors.error(result.output);
    return colors.success(result.output);
  },
};
