import React from "react";
import { Box, Text } from "ink";
import { REPL } from "./REPL.js";
import { colors } from "../utils/colors.js";

interface AppProps {
  apiKey: string;
  model: string;
}

export function App({ apiKey, model }: AppProps) {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1} paddingX={1}>
        <Text>{colors.header("youtube-cc")}</Text>
        <Text>{colors.muted(` (${model})`)}</Text>
      </Box>
      <Box paddingX={1} marginBottom={1}>
        <Text>{colors.muted('Type a message to chat. "exit" to quit.')}</Text>
      </Box>
      <REPL apiKey={apiKey} model={model} />
    </Box>
  );
}
