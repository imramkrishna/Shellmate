import React from "react";
import { Box } from "ink";
import { REPL } from "./REPL.js";

interface AppProps {
  apiKey: string;
  model: string;
}

export function App({ apiKey, model }: AppProps) {
  return (
    <Box flexDirection="column">
      <REPL apiKey={apiKey} model={model} />
    </Box>
  );
}
