import React, { useState, useCallback, useRef, useEffect } from "react";
import { Box, useApp } from "ink";
import { TextInput } from "./components/TextInput.js";
import { AskUserPrompt } from "./components/AskUserPrompt.js";
import {
  MessageList,
  type CompletedMessage,
} from "./components/MessageList.js";
import { Conversation } from "../core/query.js";
import { OpenRouterClient } from "../api/client.js";
import type { MessageLoopCallbacks } from "../core/messageLoop.js";
import {
  setInputHandler,
  clearInputHandler,
  type UserInputRequest,
} from "../utils/askUserBridge.js";

interface REPLProps {
  apiKey: string;
  model: string;
}

export function REPL({ apiKey, model }: REPLProps) {
  const { exit } = useApp();
  const [completedMessages, setCompletedMessages] = useState<
    CompletedMessage[]
  >([
    { id: "0", type: "welcome", content: "", model },
  ]);
  const [streamingText, setStreamingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExecutingTools, setIsExecutingTools] = useState(false);
  const [commands, setCommands] = useState<string[]>([]);
  const msgIdRef = useRef(0);

  // Ask-user bridge state
  const [pendingRequest, setPendingRequest] = useState<UserInputRequest | null>(null);
  const resolverRef = useRef<((answer: string) => void) | null>(null);

  // Register the input handler bridge on mount
  useEffect(() => {
    setInputHandler((request: UserInputRequest) => {
      // Reject any previous pending promise before creating a new one to prevent hanging when two quicks questions are asked
      if (resolverRef.current) {
        resolverRef.current("");  // settle the old promise with empty string
      }
      return new Promise<string>((resolve) => {
        resolverRef.current = resolve;
        setPendingRequest(request);
      });
    });
    return () => {
      // Settle any pending promise before clearing the handler
      if (resolverRef.current) {
        resolverRef.current("");
        resolverRef.current = null;
      }
      setPendingRequest(null);
      clearInputHandler();
    };
  }, []);

  const handleUserAnswer = useCallback((answer: string) => {
    if (resolverRef.current) {
      resolverRef.current(answer);
      resolverRef.current = null;
    }
    setPendingRequest(null);
  }, []);

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
      setCommands((prev) => [...prev, input]);
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
    <Box flexDirection="column" paddingX={1}>
      <MessageList
        completedMessages={completedMessages}
        streamingText={streamingText}
        isLoading={isLoading}
        isExecutingTools={isExecutingTools}
      />
      {pendingRequest ? (
        <AskUserPrompt request={pendingRequest} onAnswer={handleUserAnswer} />
      ) : (
        <TextInput onSubmit={handleSubmit} isDisabled={isLoading} commands={commands} />
      )}
    </Box>
  );
}
