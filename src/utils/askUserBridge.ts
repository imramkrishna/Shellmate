/**
 * Bridge between the askUser tool and the Ink UI layer.
 * The tool calls requestUserInput(), which creates a promise.
 * The REPL component resolves it when the user responds via the UI.
 */

export interface UserInputRequest {
  question: string;
  options?: string[];
  type: "text" | "select" | "confirm";
  required: boolean;
}

type InputHandler = (request: UserInputRequest) => Promise<string>;

let inputHandler: InputHandler | null = null;

export function setInputHandler(handler: InputHandler) {
  inputHandler = handler;
}

export function clearInputHandler() {
  inputHandler = null;
}

export async function requestUserInput(request: UserInputRequest): Promise<string> {
  if (!inputHandler) {
    throw new Error("No input handler registered. The UI layer must call setInputHandler().");
  }
  return inputHandler(request);
}
