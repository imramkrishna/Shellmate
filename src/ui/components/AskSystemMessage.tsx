import { useState, useCallback } from "react";
import type { UserInputRequest } from "../../utils/askUserBridge.js";
import { Box, Text } from "ink";
import InkTextInput from "ink-text-input";
import { SelectInput } from "./SelectInput.js";

interface AskSystemMessageProps {
    requests: UserInputRequest[];
    onComplete: (answers: string[]) => void;
}

export function AskSystemMessage({ requests, onComplete }: AskSystemMessageProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [textValue, setTextValue] = useState("");

    const current = requests[currentIndex];

    const advance = useCallback(
        (answer: string) => {
            const updated = [...answers, answer];
            setAnswers(updated);
            setTextValue("");
            if (currentIndex + 1 < requests.length) {
                setCurrentIndex(currentIndex + 1);
            } else {
                onComplete(updated);
            }
        },
        [answers, currentIndex, requests.length, onComplete]
    );

    const handleTextSubmit = useCallback(
        (value: string) => {
            if (!current) return;
            const trimmed = value.trim();
            if (current.required && !trimmed) return;
            advance(trimmed);
        },
        [current, advance]
    );

    const handleSelect = useCallback(
        (value: string) => advance(value),
        [advance]
    );

    const handleConfirm = useCallback(
        (value: string) => advance(value),
        [advance]
    );

    return (
        <Box flexDirection="column" marginY={1} paddingX={1}>
            {/* Already-answered questions */}
            {answers.map((ans, i) => (
                <Box key={i} marginLeft={1}>
                    <Text color="green" bold>{"✔ "}</Text>
                    <Text bold>{requests[i].question}</Text>
                    <Text color="#6B7280">{" — "}{ans}</Text>
                </Box>
            ))}

            {/* Current question */}
            {current && (
                <>
                    <Box marginLeft={1}>
                        <Text color="#D4845A" bold>{"? "}</Text>
                        <Text bold>{current.question}</Text>
                    </Box>

                    {current.type === "confirm" && (
                        <ConfirmPrompt onConfirm={handleConfirm} />
                    )}

                    {current.type === "select" && current.options && current.options.length > 0 && (
                        <SelectInput items={current.options} onSelect={handleSelect} />
                    )}

                    {current.type === "text" && (
                        <Box flexDirection="column" marginLeft={3} marginTop={1}>
                            {!current.required && (
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
                </>
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