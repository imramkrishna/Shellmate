import React from "react";
import { Box, Text, Static } from "ink";
import Spinner from "ink-spinner";
import type { ToolExecutionResult } from "../../core/toolExecutor.js";
import { ToolResultDisplay } from "./ToolResult.js";
import { WelcomeScreen } from "./WelcomeScreen.js";
import { colors } from "../../utils/colors.js";

export interface CompletedMessage {
  id: string;
  type: "user" | "assistant" | "tool_results" | "error" | "welcome";
  content: string;
  toolResults?: ToolExecutionResult[];
  model?: string;
}

interface MessageListProps {
  completedMessages: CompletedMessage[];
  streamingText: string;
  isLoading: boolean;
  isExecutingTools: boolean;
}

function MessageContent({ msg }: { msg: CompletedMessage }) {
  if (msg.type === "welcome") {
    return <WelcomeScreen model={msg.model || ""} />;
  }

  if (msg.type === "user") {
    return (
      <Box marginBottom={1} marginLeft={1}>
        <Text color="#D4845A" bold>{"❯ "}</Text>
        <Text bold>{msg.content}</Text>
      </Box>
    );
  }

  if (msg.type === "assistant") {
    return (
      <Box marginBottom={1} marginLeft={2} flexDirection="column">
        <Box>
          <Text color="#D4845A">{"┃ "}</Text>
          <Text color="#9CA3AF" dimColor>{"ShellMate"}</Text>
        </Box>
        <Box flexDirection="column" marginLeft={0}>
          {msg.content.split("\n").map((line, i) => (
            <Box key={i}>
              <Text color="#4B5563">{"┃ "}</Text>
              <Text>{line}</Text>
            </Box>
          ))}
        </Box>
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
      <Box marginBottom={1} marginLeft={2}>
        <Text color="#EF4444" bold>{"✗ "}</Text>
        <Text color="#EF4444">{msg.content}</Text>
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
        <Box marginBottom={1} marginLeft={2} flexDirection="column">
          <Box>
            <Text color="#D4845A">{"┃ "}</Text>
            <Text color="#9CA3AF" dimColor>{"ShellMate"}</Text>
          </Box>
          {streamingText.split("\n").map((line, i) => (
            <Box key={i}>
              <Text color="#4B5563">{"┃ "}</Text>
              <Text>{line}</Text>
            </Box>
          ))}
        </Box>
      )}

      {isExecutingTools && (
        <Box marginLeft={2}>
          <Text color="#4B5563">{"┃ "}</Text>
          <Text color="#D4845A">
            <Spinner type="dots" />{" "}
          </Text>
          <Text>{colors.muted("Running tools…")}</Text>
        </Box>
      )}

      {isLoading && !streamingText && !isExecutingTools && (
        <Box marginLeft={2}>
          <Text color="#4B5563">{"┃ "}</Text>
          <Text color="#D4845A">
            <Spinner type="dots" />{" "}
          </Text>
          <Text>{colors.muted("Thinking…")}</Text>
        </Box>
      )}
    </Box>
  );
}
