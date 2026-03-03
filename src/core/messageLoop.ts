import type { ChatMessage, ToolCall, ToolCallDelta } from "../api/types.js";
import { OpenRouterClient } from "../api/client.js";
import { getToolDefinitions } from "../tools/index.js";
import { buildSystemPrompt } from "./systemPrompt.js";
import {
  executeToolCalls,
  type ToolExecutionResult,
} from "./toolExecutor.js";

export interface MessageLoopCallbacks {
  onToken: (token: string) => void;
  onToolStart: (toolCalls: ToolCall[]) => void;
  onToolResult: (results: ToolExecutionResult[]) => void;
  onComplete: (text: string) => void;
  onError: (error: Error) => void;
}

export async function runMessageLoop(
  client: OpenRouterClient,
  messages: ChatMessage[],
  model: string,
  callbacks: MessageLoopCallbacks
): Promise<ChatMessage[]> {
  const systemMessage: ChatMessage = {
    role: "system",
    content: buildSystemPrompt(),
  };

  const tools = getToolDefinitions();
  let continueLoop = true;

  while (continueLoop) {
    try {
      let assistantText = "";
      const toolCallDeltas: Map<number, { id: string; name: string; arguments: string }> = new Map();

      const stream = client.streamChatCompletion({
        model,
        messages: [systemMessage, ...messages],
        tools: tools.length > 0 ? tools : undefined,
      });

      let finishReason: string | null = null;

      for await (const chunk of stream) {
        const choice = chunk.choices[0];
        if (!choice) continue;

        // Handle text content
        if (choice.delta.content) {
          assistantText += choice.delta.content;
          callbacks.onToken(choice.delta.content);
        }

        // Handle tool call deltas
        if (choice.delta.tool_calls) {
          for (const delta of choice.delta.tool_calls) {
            accumulateToolCallDelta(toolCallDeltas, delta);
          }
        }

        if (choice.finish_reason) {
          finishReason = choice.finish_reason;
        }
      }

      // Build the completed tool calls array
      const toolCalls: ToolCall[] = Array.from(toolCallDeltas.values()).map(
        (tc) => ({
          id: tc.id,
          type: "function" as const,
          function: {
            name: tc.name,
            arguments: tc.arguments,
          },
        })
      );

      if (
        finishReason === "tool_calls" ||
        (toolCalls.length > 0 && finishReason !== "stop")
      ) {
        // Add assistant message with tool calls
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: assistantText || null,
          tool_calls: toolCalls,
        };
        messages.push(assistantMessage);

        callbacks.onToolStart(toolCalls);

        // Execute tools
        const { messages: toolMessages, results } =
          await executeToolCalls(toolCalls);

        messages.push(...toolMessages);
        callbacks.onToolResult(results);

        // Continue the loop for another round
      } else {
        // finish_reason is "stop" or no tool calls - we're done
        if (assistantText) {
          messages.push({
            role: "assistant",
            content: assistantText,
          });
        }
        callbacks.onComplete(assistantText);
        continueLoop = false;
      }
    } catch (error) {
      callbacks.onError(
        error instanceof Error ? error : new Error(String(error))
      );
      continueLoop = false;
    }
  }

  return messages;
}

function accumulateToolCallDelta(
  accumulator: Map<number, { id: string; name: string; arguments: string }>,
  delta: ToolCallDelta
) {
  const existing = accumulator.get(delta.index);

  if (!existing) {
    accumulator.set(delta.index, {
      id: delta.id || "",
      name: delta.function?.name || "",
      arguments: delta.function?.arguments || "",
    });
  } else {
    if (delta.id) existing.id = delta.id;
    if (delta.function?.name) existing.name = delta.function.name;
    if (delta.function?.arguments)
      existing.arguments += delta.function.arguments;
  }
}
