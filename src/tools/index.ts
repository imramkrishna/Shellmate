import { zodToJsonSchema } from "zod-to-json-schema";
import type { Tool } from "./types.js";
import type { ToolDefinition } from "../api/types.js";
import { bashTool } from "./bash.js";
import { readTool } from "./read.js";
import { writeTool } from "./write.js";
import { editTool } from "./edit.js";
import { globTool } from "./glob.js";
import { grepTool } from "./grep.js";

const toolRegistry = new Map<string, Tool>();

function registerTool(tool: Tool) {
  toolRegistry.set(tool.name, tool);
}

registerTool(bashTool);
registerTool(readTool);
registerTool(writeTool);
registerTool(editTool);
registerTool(globTool);
registerTool(grepTool);

export function getTool(name: string): Tool | undefined {
  return toolRegistry.get(name);
}

export function getAllTools(): Tool[] {
  return Array.from(toolRegistry.values());
}

export function getToolDefinitions(): ToolDefinition[] {
  return getAllTools().map((tool) => {
    const jsonSchema = zodToJsonSchema(tool.inputSchema, {
      target: "openApi3",
      $refStrategy: "none",
    });

    // Remove the wrapper properties that zodToJsonSchema adds
    const { $schema, ...parameters } = jsonSchema as Record<string, unknown>;

    return {
      type: "function" as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters,
      },
    };
  });
}
