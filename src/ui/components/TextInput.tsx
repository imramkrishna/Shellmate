import React from "react";
import { Box, Text } from "ink";
import InkTextInput from "ink-text-input";
import { colors } from "../../utils/colors.js";

interface TextInputProps {
  onSubmit: (value: string) => void;
  isDisabled?: boolean;
}

export function TextInput({ onSubmit, isDisabled }: TextInputProps) {
  const [value, setValue] = React.useState("");

  const handleSubmit = (submitValue: string) => {
    if (submitValue.trim() && !isDisabled) {
      onSubmit(submitValue.trim());
      setValue("");
    }
  };

  if (isDisabled) {
    return null;
  }

  return (
    <Box>
      <Text>{colors.prompt("> ")}</Text>
      <InkTextInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        placeholder="Type a message..."
      />
    </Box>
  );
}
