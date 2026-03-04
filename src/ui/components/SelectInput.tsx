import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { colors } from "../../utils/colors.js";

interface SelectInputProps {
  items: string[];
  onSelect: (value: string) => void;
}

export function SelectInput({ items, onSelect }: SelectInputProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setActiveIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
    } else if (key.downArrow) {
      setActiveIndex((prev) => (prev >= items.length - 1 ? 0 : prev + 1));
    } else if (key.return) {
      onSelect(items[activeIndex]);
    }
  });

  return (
    <Box flexDirection="column" marginLeft={2}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <Box key={index}>
            <Text color={isActive ? "#D4845A" : undefined}>
              {isActive ? "❯ " : "  "}
            </Text>
            <Text bold={isActive} color={isActive ? "#D4845A" : undefined}>
              {item}
            </Text>
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text>{colors.muted("↑/↓ to navigate, Enter to select")}</Text>
      </Box>
    </Box>
  );
}
