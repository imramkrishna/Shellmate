import React from "react";
import { Box, Text } from "ink";
import type { ToolExecutionResult } from "../../core/toolExecutor.js";
import { colors } from "../../utils/colors.js";

interface ToolResultProps {
  result: ToolExecutionResult;
}

export function ToolResultDisplay({ result }: ToolResultProps) {
  const maxLines = 15;
  const summary = typeof result.resultSummary === "string" ? result.resultSummary : JSON.stringify(result.resultSummary, null, 2);
  const resultLines = summary.split("\n");
  const truncated = resultLines.length > maxLines;
  const displayLines = truncated
    ? resultLines.slice(0, maxLines)
    : resultLines;

  const isError = result.result.isError;
  const statusIcon = isError ? "✗" : "✓";
  const statusColor = isError ? "#EF4444" : "#4ADE80";
  const statusLabel = isError ? " failed" : " done";
  const borderChar = "│";

  return (
    <Box flexDirection="column" marginLeft={3} marginBottom={1}>
      {/* Top edge */}
      <Box>
        <Text color="#4B5563">{"╭─ "}</Text>
        <Text color="#FBBF24" bold>{"⚡ "}</Text>
        <Text bold>{result.callSummary}</Text>
      </Box>

      {/* Body */}
      {displayLines.map((line, i) => (
        <Box key={i}>
          <Text color="#4B5563">{borderChar + " "}</Text>
          <Text color="#9CA3AF">{line}</Text>
        </Box>
      ))}

      {truncated && (
        <Box>
          <Text color="#4B5563">{borderChar + " "}</Text>
          <Text>{colors.muted(`… ${resultLines.length - maxLines} more lines`)}</Text>
        </Box>
      )}

      {/* Bottom edge with status */}
      <Box>
        <Text color="#4B5563">{"╰─ "}</Text>
        <Text color={statusColor} bold>{statusIcon}</Text>
        <Text color={statusColor}>{statusLabel}</Text>
      </Box>
    </Box>
  );
}
