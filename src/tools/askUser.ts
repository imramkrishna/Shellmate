import z from "zod";
import { Tool, ToolResult } from "./types.js";
import * as readline from "readline";
import chalk from "chalk";

const inputSchema = z.object({
  question: z.string()
    .describe("Question that needs to be asked to user"),
  options: z.array(z.string())
    .optional()
    .describe("Options to choose from. If empty, user can type freely"),
  type: z.enum(["text", "select", "confirm"])
    .default("text")
    .describe("text = free input, select = pick from options, confirm = yes/no"),
  required: z.boolean()
    .default(true)
    .describe("Whether the user must answer this question")
});

function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export const askUser: Tool = {
  name: "ask_user",
  description: "Ask the user when more information is needed about any operation.",
  inputSchema,

  async call(input): Promise<ToolResult> {
    const { question, options, type, required } = inputSchema.parse(input);
    if (type === "confirm") {
      console.log(chalk.yellow(`\n❓ ${question} (yes/no)`));
      const answer = await promptUser(chalk.cyan("> "));
      const confirmed = ["yes", "y"].includes(answer.toLowerCase());
      return {
        isError: false,
        output: confirmed ? "yes" : "no"
      };
    }
    if (type === "select" && options && options.length > 0) {
      console.log(chalk.yellow(`\n❓ ${question}`));
      options.forEach((opt, i) => {
        console.log(chalk.cyan(`  ${i + 1}. ${opt}`));
      });

      const answer = await promptUser(chalk.cyan("\n> "));

      const index = parseInt(answer) - 1;
      const selected = !isNaN(index) && options[index]
        ? options[index]
        : answer;

      return {
        isError: false,
        output: selected
      };
    }
    console.log(chalk.yellow(`\n❓ ${question}`));
    if (!required) {
      console.log(chalk.gray("  (optional, press enter to skip)"));
    }

    const answer = await promptUser(chalk.cyan("> "));

    if (required && !answer) {
      return this.call(input);
    }

    return {
      isError: false,
      output: answer || ""
    };
  },

  renderToolCall(input): string {
    const parsed = inputSchema.safeParse(input);
    if (!parsed.success) return "Asking user...";
    return `❓ Asking: ${parsed.data.question}`;
  },

  renderResult(result): string {
    return `✅ User answered: ${result.output}`;
  }
};