import { z } from "zod";
import { exec } from "child_process";
import type { Tool, ToolResult } from "./types.js";
import { colors } from "../utils/colors.js";

const inputSchema = z.object({
  command: z.string().describe("The bash command to execute"),
  timeout: z
    .number()
    .optional()
    .default(30000)
    .describe("Timeout in milliseconds (default 30s)"),
});

export const bashTool: Tool = {
  name: "bash",
  description:
    "Execute a bash command and return its output. Use for running shell commands, installing packages, running scripts, etc.",
  inputSchema,

  async call(input): Promise<ToolResult> {
    const { command, timeout } = inputSchema.parse(input);

    return new Promise((resolve) => {
      exec(command, { timeout, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error && !stdout && !stderr) {
          resolve({
            output: `Error: ${error.message}`,
            isError: true,
          });
          return;
        }

        let output = "";
        if (stdout) output += stdout;
        if (stderr) output += (output ? "\n" : "") + stderr;
        if (!output) output = "(no output)";

        resolve({
          output: output.trim(),
          isError: !!error,
        });
      });
    });
  },

  renderToolCall(input) {
    const { command } = inputSchema.parse(input);
    return `${colors.toolName("bash")} ${colors.muted("$")} ${command}`;
  },

  renderResult(result) {
    if (result.isError) {
      return colors.error(result.output);
    }
    return result.output;
  },
};
