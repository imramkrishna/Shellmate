import React, { useState, useCallback } from "react";
import { Box, Text } from "ink";
import InkTextInput from "ink-text-input";
import { SelectInput } from "./SelectInput.js";
import type { UserInputRequest } from "../../utils/askUserBridge.js";

interface AskUserPromptProps {
  request: UserInputRequest;
  onAnswer: (answer: string) => void;
}

export function AskUserPrompt({ request, onAnswer }: AskUserPromptProps) {
  const [textValue, setTextValue] = useState("");

  const handleTextSubmit = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (request.required && !trimmed) return;
      onAnswer(trimmed);
    },
    [request.required, onAnswer]
  );

  const handleSelect = useCallback(
    (value: string) => {
      onAnswer(value);
    },
    [onAnswer]
  );

  const handleConfirm = useCallback(
    (value: string) => {
      onAnswer(value);
    },
    [onAnswer]
  );

  return (
    <Box flexDirection="column" marginY={1} paddingX={1}>
      <Box marginLeft={1}>
        <Text color="#D4845A" bold>{"? "}</Text>
        <Text bold>{request.question}</Text>
      </Box>

      {request.type === "confirm" && (
        <ConfirmPrompt onConfirm={handleConfirm} />
      )}

      {request.type === "select" && request.options && request.options.length > 0 && (
        <SelectInput items={request.options} onSelect={handleSelect} />
      )}

      {request.type === "text" && (
        <Box flexDirection="column" marginLeft={3} marginTop={1}>
          {!request.required && (
            <Text color="#6B7280" dimColor>{"  (optional — press Enter to skip)"}</Text>
          )}
          <Box>
            <Text bold color="#D4845A">{"❯ "}</Text>
            <InkTextInput
              value={textValue}
              onChange={setTextValue}
              onSubmit={handleTextSubmit}
              placeholder="Type your answer…"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

function ConfirmPrompt({ onConfirm }: { onConfirm: (value: string) => void }) {
  return (
    <SelectInput
      items={["Yes", "No"]}
      onSelect={(value) => onConfirm(value.toLowerCase() === "yes" ? "yes" : "no")}
    />
  );
}
