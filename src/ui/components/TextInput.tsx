import React from "react";
import { Box, Text, useInput } from "ink";
import InkTextInput from "ink-text-input";
import { colors } from "../../utils/colors.js";

interface TextInputProps {
  onSubmit: (value: string) => void;
  isDisabled?: boolean;
  commands?: string[];
}

export function TextInput({ onSubmit, isDisabled, commands = [] }: TextInputProps) {
  const [value, setValue] = React.useState("");
  const [historyIndex, setHistoryIndex] = React.useState<number | null>(null);

  const handleSubmit = (submitValue: string) => {
    if (submitValue.trim() && !isDisabled) {
      onSubmit(submitValue.trim());
      setValue("");
      setHistoryIndex(null);
    }
  };

  useInput((_input, key) => {
    if (isDisabled) return;

    if (key.upArrow) {
      if (commands.length === 0) return;
      if (historyIndex === null) {
        const idx = commands.length - 1;
        setHistoryIndex(idx);
        setValue(commands[idx]);
      } else if (historyIndex > 0) {
        const idx = historyIndex - 1;
        setHistoryIndex(idx);
        setValue(commands[idx]);
      }
    }

    if (key.downArrow) {
      if (historyIndex === null) return;
      if (historyIndex < commands.length - 1) {
        const idx = historyIndex + 1;
        setHistoryIndex(idx);
        setValue(commands[idx]);
      } else {
        setHistoryIndex(null);
        setValue("");
      }
    }
  });

  if (isDisabled) {
    return null;
  }

  return (
    <Box flexDirection="column">
      <Box
        borderStyle="round"
        borderColor="#4B5563"
        borderLeft={false}
        borderRight={false}
        paddingLeft={1}
        flexDirection="column"
      >
        <Box>
          <Text bold color="#D4845A">{"❯ "}</Text>
          <InkTextInput
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            placeholder='Send a message…'
          />
        </Box>
        <Box>
          <Text color="#6B7280" dimColor>{"  ? shortcuts  ↑↓ history"}</Text>
        </Box>
      </Box>
    </Box>
  );
}
