import React from "react";
import { Box, Text } from "ink";
import type { ToolExecutionResult } from "../../core/toolExecutor.js";
import { colors } from "../../utils/colors.js";

interface ToolResultProps {
  result: ToolExecutionResult;
}

export function ToolResultDisplay({ result }: ToolResultProps) {
  const maxLines = 15;
  const resultLines = result.resultSummary.split("\n");
  const truncated = resultLines.length > maxLines;
  const displayLines = truncated
    ? resultLines.slice(0, maxLines).join("\n")
    : result.resultSummary;

  return (
    <Box flexDirection="column" marginLeft={1} marginBottom={1}>
      <Box>
        <Text>{colors.muted("  ┌ ")}</Text>
        <Text>{result.callSummary}</Text>
      </Box>
      <Box marginLeft={2}>
        <Text>{colors.muted("│ ")}</Text>
        <Text>
          {displayLines}
          {truncated
            ? `\n${colors.muted(`  ... (${resultLines.length - maxLines} more lines)`)}`
            : ""}
        </Text>
      </Box>
      <Box>
        <Text>{colors.muted("  └ ")}</Text>
        <Text>
          {result.result.isError
            ? colors.error("error")
            : colors.success("done")}
        </Text>
      </Box>
    </Box>
  );
}
