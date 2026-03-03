import type {
  ChatCompletionRequest,
  ChatCompletionChunk,
} from "./types.js";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export class OpenRouterClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async *streamChatCompletion(
    request: ChatCompletionRequest
  ): AsyncGenerator<ChatCompletionChunk> {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/youtube-cc",
        "X-Title": "youtube-cc",
      },
      body: JSON.stringify({ ...request, stream: true }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `OpenRouter API error (${response.status}): ${errorBody}`
      );
    }

    if (!response.body) {
      throw new Error("No response body received");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const data = trimmed.slice(6);
          if (data === "[DONE]") return;

          try {
            const chunk = JSON.parse(data) as ChatCompletionChunk;
            yield chunk;
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
