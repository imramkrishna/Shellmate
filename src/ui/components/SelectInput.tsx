import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

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
    <Box flexDirection="column" marginLeft={3} marginTop={1}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <Box key={index}>
            <Text color={isActive ? "#D4845A" : "#4B5563"}>
              {isActive ? "● " : "○ "}
            </Text>
            <Text bold={isActive} color={isActive ? "#F9FAFB" : "#9CA3AF"}>
              {item}
            </Text>
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text color="#6B7280" dimColor>{"  ↑↓ navigate  ⏎ select"}</Text>
      </Box>
    </Box>
  );
}
