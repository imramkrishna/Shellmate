import React, { useState, useCallback, useRef } from "react";
import { Box, useApp } from "ink";
import { TextInput } from "./components/TextInput.js";
import {
  MessageList,
  type CompletedMessage,
} from "./components/MessageList.js";
import { Conversation } from "../core/query.js";
import { OpenRouterClient } from "../api/client.js";
import type { MessageLoopCallbacks } from "../core/messageLoop.js";

interface REPLProps {
  apiKey: string;
  model: string;
}

export function REPL({ apiKey, model }: REPLProps) {
  const { exit } = useApp();
  const [completedMessages, setCompletedMessages] = useState<
    CompletedMessage[]
  >([]);
  const [streamingText, setStreamingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExecutingTools, setIsExecutingTools] = useState(false);
  const msgIdRef = useRef(0);

  const conversationRef = useRef(
    new Conversation(new OpenRouterClient(apiKey), model)
  );

  const nextId = useCallback(() => {
    msgIdRef.current += 1;
    return String(msgIdRef.current);
  }, []);

  const handleSubmit = useCallback(
    async (input: string) => {
      if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
        exit();
        return;
      }

      // Add user message
      setCompletedMessages((prev) => [
        ...prev,
        { id: nextId(), type: "user", content: input },
      ]);
      setIsLoading(true);
      setStreamingText("");

      const callbacks: MessageLoopCallbacks = {
        onToken: (token) => {
          setStreamingText((prev) => prev + token);
        },
        onToolStart: () => {
          // Flush any streaming text as a completed message
          setStreamingText((current) => {
            if (current) {
              setCompletedMessages((prev) => [
                ...prev,
                { id: nextId(), type: "assistant", content: current },
              ]);
            }
            return "";
          });
          setIsExecutingTools(true);
        },
        onToolResult: (results) => {
          setIsExecutingTools(false);
          setCompletedMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              type: "tool_results",
              content: "",
              toolResults: results,
            },
          ]);
        },
        onComplete: (text) => {
          setStreamingText("");
          setIsLoading(false);
          // Only add if there's text and it wasn't already flushed
          setCompletedMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (text && lastMsg?.content !== text) {
              return [
                ...prev,
                { id: nextId(), type: "assistant", content: text },
              ];
            }
            return prev;
          });
        },
        onError: (error) => {
          setStreamingText("");
          setIsLoading(false);
          setIsExecutingTools(false);
          setCompletedMessages((prev) => [
            ...prev,
            { id: nextId(), type: "error", content: error.message },
          ]);
        },
      };

      try {
        await conversationRef.current.send(input, callbacks);
      } catch (error) {
        callbacks.onError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    },
    [exit, nextId]
  );

  return (
    <Box flexDirection="column" padding={1}>
      <MessageList
        completedMessages={completedMessages}
        streamingText={streamingText}
        isLoading={isLoading}
        isExecutingTools={isExecutingTools}
      />
      <TextInput onSubmit={handleSubmit} isDisabled={isLoading} />
    </Box>
  );
}
