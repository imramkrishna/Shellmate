import React, { useState, useCallback } from "react";
import { Box } from "ink";
import { REPL } from "./REPL.js";
import { WelcomeScreen } from "./components/WelcomeScreen.js";

interface AppProps {
  apiKey: string;
  model: string;
}

export function App({ apiKey, model }: AppProps) {
  const [showWelcome, setShowWelcome] = useState(true);

  const hideWelcome = useCallback(() => {
    setShowWelcome(false);
  }, []);

  return (
    <Box flexDirection="column">
      {showWelcome && <WelcomeScreen model={model} />}
      <REPL apiKey={apiKey} model={model} onFirstMessage={hideWelcome} />
    </Box>
  );
}
