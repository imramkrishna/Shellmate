import React from "react";
import { Box, Text } from "ink";
import InkTextInput from "ink-text-input";
import { colors } from "../../utils/colors.js";
import { useInput } from "ink";
interface TextInputProps {
  onSubmit: (value: string) => void;
  isDisabled?: boolean;
  commands: string[]
}

export function TextInput({ onSubmit, isDisabled, commands }: TextInputProps) {
  const [value, setValue] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null)
  const handleSubmit = (submitValue: string) => {
    if (submitValue.trim() && !isDisabled) {
      onSubmit(submitValue.trim());
      setValue("");
      setCurrentIndex(null);
    }
  };

  useInput((_input, key) => {
    if (key.upArrow) {
      if (commands.length === 0) return;

      if (currentIndex === null) {
        // Start browsing from the most recent command
        const idx = commands.length - 1;
        setCurrentIndex(idx);
        setValue(commands[idx]);
      } else if (currentIndex > 0) {
        // Go to an older command
        const idx = currentIndex - 1;
        setCurrentIndex(idx);
        setValue(commands[idx]);
      }
    }
    if (key.downArrow) {
      if (currentIndex === null) return;

      if (currentIndex < commands.length - 1) {
        // Go to a newer command
        const idx = currentIndex + 1;
        setCurrentIndex(idx);
        setValue(commands[idx]);
      } else {
        // Past the newest command — clear input
        setCurrentIndex(null);
        setValue("");
      }
    }
  });
  if (isDisabled) {
    return null;
  }

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>{colors.prompt("> ")}</Text>
        <InkTextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder='Type a message or "exit" to quit'
        />
      </Box>
      <Box marginLeft={2}>
        <Text>{colors.muted("? ")}</Text>
        <Text>{colors.muted("shortcuts")}</Text>
      </Box>
    </Box>
  );
}
