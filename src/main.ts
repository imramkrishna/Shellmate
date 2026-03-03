import { Command } from "commander";
import React from "react";
import { render } from "ink";
import { App } from "./ui/App.js";

export function createCLI() {
  const program = new Command();

  program
    .name("coder")
    .description("A simplified Coding assistant - AI coding assistant in your terminal")
    .version("1.0.0")
    .option(
      "-m, --model <model>",
      "Model to use via OpenRouter",
      "anthropic/claude-sonnet-4"
    )
    .action((options) => {
      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        console.error(
          "Error: OPENROUTER_API_KEY environment variable is required.\n" +
            "Set it with: export OPENROUTER_API_KEY=your_key_here"
        );
        process.exit(1);
      }

      render(
        React.createElement(App, {
          apiKey,
          model: options.model,
        })
      );
    });

  return program;
}
