import { z } from "zod";

export interface ToolResult {
  output: string;
  isError?: boolean;
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: z.ZodObject<z.ZodRawShape>;
  call(input: Record<string, unknown>): Promise<ToolResult>;
  renderToolCall(input: Record<string, unknown>): string;
  renderResult(result: ToolResult): string;
}
