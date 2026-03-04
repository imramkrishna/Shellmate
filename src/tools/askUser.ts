import z from "zod";
import { Tool, ToolResult } from "./types.js";
import { requestUserInput } from "../utils/askUserBridge.js";

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

export const askUser: Tool = {
  name: "ask_user",
  description: "Ask the user when more information is needed about any operation.",
  inputSchema,

  async call(input): Promise<ToolResult> {
    const { question, options, type, required } = inputSchema.parse(input);

    const answer = await requestUserInput({
      question,
      options,
      type,
      required,
    });

    return {
      isError: false,
      output: answer || "",
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