import { z } from "zod"
import { Tool, ToolResult } from "./types.js"
import { analyzeFile, analyzeFolder } from "../lib/files.js";
import { colors } from "../utils/colors.js";

const inputSchema = z.object({
    path: z.string()
        .default(process.cwd())
        .describe("Path to a file or folder to analyze. Defaults to current working directory."),
    type: z.enum(["file", "folder"]).default("folder"),
});
export const analyzeFileAndFolders: Tool = {
    name: "analyze_file_structure",
    description: "Analyzes the structure of a file or folder using AST (Abstract Syntax Tree). Use this tool when you need to understand code structure before making changes — extracts functions, classes, imports, exports, and variable declarations without reading raw file content. Prefer this over read_file when refactoring, finding unused code, or understanding how a codebase is organized.",
    inputSchema,
    async call(input): Promise<ToolResult> {
        const { path, type } = inputSchema.parse(input)
        let analysis
        if (type == "folder") {
            analysis = await analyzeFolder(path)
        } else {
            analysis = await analyzeFile(path)
        }
        return {
            isError: false,
            output: analysis
        }
    },
    renderToolCall(input): string {
        const parsed = inputSchema.parse(input);
        if (parsed.type == "file") return `Analysing the File ${parsed.path}`
        else return `Analysing the Folder Structure ${parsed.path}`
    },
    renderResult(result) {
        if (result.isError) {
            return colors.error(String(result.output));
        }
        return JSON.stringify(result.output, null, 2);
    },
}
