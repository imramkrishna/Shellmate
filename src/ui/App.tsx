import React from "react";
import { Box } from "ink";
import { REPL } from "./REPL.js";
import { WelcomeScreen } from "./components/WelcomeScreen.js";

interface AppProps {
  apiKey: string;
  model: string;
}

export function App({ apiKey, model }: AppProps) {
  return (
    <Box flexDirection="column">
      <WelcomeScreen model={model} />
      <REPL apiKey={apiKey} model={model}/>
    </Box> 
  );
}
