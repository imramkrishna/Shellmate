import { z } from "zod";
import { exec } from "child_process";
import type { Tool, ToolResult } from "./types.js";
import { colors } from "../utils/colors.js";

const inputSchema = z.object({
  pattern: z.string().describe("The regex pattern to search for"),
  path: z
    .string()
    .optional()
    .describe("File or directory to search in (defaults to cwd)"),
  include: z
    .string()
    .optional()
    .describe("Glob pattern to filter files (e.g. '*.ts')"),
});

function runCommand(cmd: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      resolve({
        stdout: stdout || "",
        stderr: stderr || "",
        exitCode: error ? (error as NodeJS.ErrnoException & { code?: number }).code ?? 1 : 0,
      });
    });
  });
}

export const grepTool: Tool = {
  name: "grep",
  description:
    "Search file contents using regex patterns. Tries ripgrep (rg) first, falls back to grep. Returns matching lines with file paths and line numbers.",
  inputSchema,

  async call(input): Promise<ToolResult> {
    const { pattern, path: searchPath, include } = inputSchema.parse(input);
    const target = searchPath || ".";

    // Try ripgrep first
    let cmd = `rg -n --max-count=100 --max-columns=200`;
    if (include) cmd += ` --glob '${include}'`;
    cmd += ` '${pattern.replace(/'/g, "'\\''")}' '${target}'`;

    let result = await runCommand(cmd);

    // Fall back to grep if rg not found
    if (result.stderr.includes("command not found") || result.stderr.includes("not found")) {
      cmd = `grep -rn --max-count=100`;
      if (include) cmd += ` --include='${include}'`;
      cmd += ` '${pattern.replace(/'/g, "'\\''")}' '${target}'`;
      result = await runCommand(cmd);
    }

    const output = result.stdout.trim();
    if (!output) {
      return { output: "No matches found." };
    }

    return { output };
  },

  renderToolCall(input) {
    const { pattern, path: searchPath, include } = inputSchema.parse(input);
    let desc = `${colors.toolName("grep")} ${colors.muted("/")}${pattern}${colors.muted("/")}`;
    if (searchPath) desc += ` ${colors.muted("in")} ${colors.fileName(searchPath)}`;
    if (include) desc += ` ${colors.muted(`(${include})`)}`;
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
