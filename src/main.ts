import { Command } from "commander";
import React from "react";
import { render } from "ink";
import { App } from "./ui/App.js";
import generateConfig from "./utils/generateConfig.js";
import getConfig from "./utils/getConfig.js";

export async function createCLI() {
  await generateConfig();
  const program = new Command();
  let credentials:Map<string,string>=await getConfig();
  let AI_MODEL=credentials.get("AI_MODEL");
  let API_KEY=credentials.get("API_KEY");
  if(!AI_MODEL){
    throw new Error("Error while selecting AI Model. Make sure to perform configurations for api key and ai model from openrouter")
  }
  program
    .name("ShellMate")
    .description("A simplified Coding assistant - AI coding assistant in your terminal")
    .version("1.0.0")
    .option(
      "-m, --model <model>",
      "Model to use via OpenRouter",
      `${AI_MODEL}`
    )
    .action((options) => {
      const apiKey =API_KEY;
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
