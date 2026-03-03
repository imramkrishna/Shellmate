import React from "react";
import { Box, Text, Static } from "ink";
import Spinner from "ink-spinner";
import type { ToolExecutionResult } from "../../core/toolExecutor.js";
import { ToolResultDisplay } from "./ToolResult.js";
import { colors } from "../../utils/colors.js";

export interface CompletedMessage {
  id: string;
  type: "user" | "assistant" | "tool_results" | "error";
  content: string;
  toolResults?: ToolExecutionResult[];
}

interface MessageListProps {
  completedMessages: CompletedMessage[];
  streamingText: string;
  isLoading: boolean;
  isExecutingTools: boolean;
}

function MessageContent({ msg }: { msg: CompletedMessage }) {
  if (msg.type === "user") {
    return (
      <Box marginBottom={1}>
        <Text>{colors.prompt("> ")}{msg.content}</Text>
      </Box>
    );
  }

  if (msg.type === "assistant") {
    return (
      <Box marginBottom={1} flexDirection="column">
        <Text>{msg.content}</Text>
      </Box>
    );
  }

  if (msg.type === "tool_results" && msg.toolResults) {
    return (
      <Box flexDirection="column">
        {msg.toolResults.map((result, i) => (
          <ToolResultDisplay key={i} result={result} />
        ))}
      </Box>
    );
  }

  if (msg.type === "error") {
    return (
      <Box marginBottom={1}>
        <Text>{colors.error("Error: ")}{msg.content}</Text>
      </Box>
    );
  }

  return null;
}

export function MessageList({
  completedMessages,
  streamingText,
  isLoading,
  isExecutingTools,
}: MessageListProps) {
  return (
    <Box flexDirection="column">
      <Static items={completedMessages}>
        {(msg) => (
          <Box key={msg.id} flexDirection="column">
            <MessageContent msg={msg} />
          </Box>
        )}
      </Static>

      {/* Live streaming area */}
      {streamingText && (
        <Box marginBottom={1} flexDirection="column">
          <Text>{streamingText}</Text>
        </Box>
      )}

      {isExecutingTools && (
        <Box>
          <Text>
            <Spinner type="dots" />{" "}
          </Text>
          <Text>{colors.muted("Executing tools...")}</Text>
        </Box>
      )}

      {isLoading && !streamingText && !isExecutingTools && (
        <Box>
          <Text>
            <Spinner type="dots" />{" "}
          </Text>
          <Text>{colors.muted("Thinking...")}</Text>
        </Box>
      )}
    </Box>
  );
}
