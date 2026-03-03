import type { ChatMessage } from "../api/types.js";
import { OpenRouterClient } from "../api/client.js";
import {
  runMessageLoop,
  type MessageLoopCallbacks,
} from "./messageLoop.js";

export class Conversation {
  private messages: ChatMessage[] = [];
  private client: OpenRouterClient;
  private model: string;

  constructor(client: OpenRouterClient, model: string) {
    this.client = client;
    this.model = model;
  }

  async send(
    userMessage: string,
    callbacks: MessageLoopCallbacks
  ): Promise<void> {
    this.messages.push({
      role: "user",
      content: userMessage,
    });

    this.messages = await runMessageLoop(
      this.client,
      this.messages,
      this.model,
      callbacks
    );
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }
}
