import type { ToolCall, ChatMessage } from "../api/types.js";
import type { ToolResult } from "../tools/types.js";
import { getTool } from "../tools/index.js";

export interface ToolExecutionResult {
  toolCall: ToolCall;
  result: ToolResult;
  callSummary: string;
  resultSummary: string;
}

export async function executeToolCalls(
  toolCalls: ToolCall[]
): Promise<{ messages: ChatMessage[]; results: ToolExecutionResult[] }> {
  const messages: ChatMessage[] = [];
  const results: ToolExecutionResult[] = [];

  for (const toolCall of toolCalls) {
    const tool = getTool(toolCall.function.name);

    let result: ToolResult;
    let callSummary: string;
    let resultSummary: string;

    if (!tool) {
      result = {
        output: `Unknown tool: ${toolCall.function.name}`,
        isError: true,
      };
      callSummary = `Unknown tool: ${toolCall.function.name}`;
      resultSummary = result.output;
    } else {
      let parsedArgs: Record<string, unknown>;
      try {
        parsedArgs = JSON.parse(toolCall.function.arguments);
      } catch {
        result = {
          output: `Invalid JSON arguments: ${toolCall.function.arguments}`,
          isError: true,
        };
        callSummary = `${tool.name} (invalid args)`;
        resultSummary = result.output;
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result.output,
        });
        results.push({ toolCall, result, callSummary, resultSummary });
        continue;
      }

      callSummary = tool.renderToolCall(parsedArgs);
      result = await tool.call(parsedArgs);
      resultSummary = tool.renderResult(result);
    }

    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: result.output,
    });

    results.push({ toolCall, result, callSummary, resultSummary });
  }

  return { messages, results };
}
