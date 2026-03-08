# ShellMate 🐚

> **Your AI-powered coding companion, right inside your terminal.**

ShellMate is a lightweight, open-source terminal AI assistant that brings the power of modern AI coding tools — like Claude Code, GitHub Copilot CLI, and Warp AI — directly to your command line. Built with TypeScript and React Ink, it provides an interactive REPL with streaming responses, an extensible tool system, and seamless integration with any AI model via [OpenRouter](https://openrouter.ai/).

Whether you're navigating a codebase, writing scripts, refactoring code, or just exploring — ShellMate has you covered.

[![npm version](https://img.shields.io/npm/v/shellmate-cli)](https://www.npmjs.com/package/shellmate-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

![ShellMate Welcome Screen](ShellMate.png)

## 🎯 Overview

ShellMate is a TypeScript-based terminal AI assistant that demonstrates the fundamental architecture of AI-powered coding tools. It connects to any LLM available on OpenRouter (Claude, GPT-4, Gemini, LLaMA, and more), executes tools locally on your machine, and streams responses token-by-token for a snappy, real-time experience.

On first run, ShellMate interactively prompts you to configure your AI model and API key — no manual `.env` setup required.

### Key Features

- 💬 **Interactive REPL** — Real-time streaming chat interface built with React and Ink
- 🛠️ **8 Built-in Tools** — File read/write/edit, shell commands, glob, grep, AST analyzer, and ask user — all callable by the AI
- 🔄 **Streaming Responses** — Token-by-token output for a responsive, conversational feel
- 🎨 **Beautiful Terminal UI** — Colorized output, spinners, and a friendly welcome screen
- 🔌 **Multi-Model Support** — Use any model on OpenRouter: Claude, GPT-4, Gemini, LLaMA, and more
- 🔀 **Live Model Switching** — Change your AI model and API key on the fly with `/change-model`
- 🎛️ **Configurable Max Tokens** — Control response length per request with `/maxtokens`
- 🌲 **AST Code Analyzer** — Understand code structure (functions, classes, imports, exports) before making changes
- ⚡ **Zero-Config Setup** — Interactive first-run wizard configures your model and API key automatically
- 📁 **Persistent `.shellmate` Config** — All configuration stored in a local `.shellmate/` directory
- 📦 **Fully Typed** — End-to-end TypeScript with Zod schema validation

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- An **OpenRouter API key** ([get one here](https://openrouter.ai/))

### Install from npm

```bash
npm install -g shellmate-cli
```

### Or clone and build locally

```bash
git clone https://github.com/imramkrishna/shellmate.git
cd shellmate
npm install
npm run build
```

### First Run

When you launch ShellMate for the first time, it will interactively prompt you to configure:

1. **AI Model** — The model identifier from OpenRouter (e.g., `anthropic/claude-sonnet-4`)
2. **API Key** — Your OpenRouter API key

This configuration is saved locally in a `.shellmate/` directory so you only need to do it once.

```bash
# Launch ShellMate
shellmate

# Or use the short alias
cc
```

### Usage

```bash
# Start with your configured default model
shellmate

# Override the model for a single session
shellmate --model anthropic/claude-3.5-sonnet

# Example queries once inside the REPL:
> List all TypeScript files in the current directory
> Read the package.json and explain the dependencies
> Create a hello world script in Python
> Search for TODO comments in the codebase
> Refactor the login function to use async/await
```

### REPL Commands

ShellMate supports special commands inside the REPL:

| Command | Description |
|---------|-------------|
| `/change-model` | Interactively update your AI model and API key |
| `/maxtokens` | Set the maximum number of tokens per response |

## 🛠️ Available Tools

ShellMate provides 8 built-in tools that the AI can use to interact with your local environment:

| Tool | Description | Example Use Cases |
|------|-------------|-------------------|
| **bash** | Execute shell commands with timeout support (30s default, 10MB buffer) | Running scripts, installing packages, git operations |
| **read** | Read file contents with line numbers and pagination | Viewing source code, inspecting config files |
| **write** | Create or overwrite files (auto-creates directories) | Generating new files, scripts, configurations |
| **edit** | Replace exact string matches in files (supports `replace_all`) | Precise code modifications, refactoring |
| **glob** | Find files matching glob patterns | File discovery, listing source files |
| **grep** | Search file contents using regex (uses ripgrep if available) | Finding code patterns, TODOs, function definitions |
| **analyze_file_structure** | AST-based code structure analysis for 30+ languages | Understanding codebase structure before making changes |
| **ask_user** | Ask the user questions during tool execution | Clarifying ambiguous requests, confirming destructive actions |

### AST Code Analyzer

The `analyze_file_structure` tool uses [ts-morph](https://ts-morph.com/) to parse source files and extract structural information via Abstract Syntax Trees. It works on individual files or entire directories.

**Extracted Information:**
- **Functions** — Name, parameters, return type, and line number
- **Classes** — Name, methods (with params, return types, line numbers), and properties
- **Imports** — Module source, named specifiers, default imports
- **Exports** — Exported declaration names
- **Variable Declarations** — Top-level constants and variables

**Supported Languages:**

| Category | Extensions |
|----------|------------|
| JavaScript / TypeScript | `.ts`, `.tsx`, `.js`, `.jsx`, `.mts`, `.cts`, `.mjs`, `.cjs` |
| Python | `.py`, `.pyw`, `.pyi` |
| Java / Kotlin / Scala | `.java`, `.kt`, `.kts`, `.scala` |
| C / C++ / Objective-C | `.c`, `.h`, `.cpp`, `.cxx`, `.cc`, `.hpp`, `.hxx`, `.m`, `.mm` |
| C# | `.cs` |
| Go | `.go` |
| Rust | `.rs` |
| Ruby | `.rb`, `.erb` |
| PHP | `.php` |
| Swift | `.swift` |
| Dart | `.dart` |
| Shell | `.sh`, `.bash`, `.zsh`, `.fish` |
| Elixir / Erlang | `.ex`, `.exs`, `.erl` |
| Haskell | `.hs` |
| Lua | `.lua` |
| R | `.r`, `.R` |
| Perl | `.pl`, `.pm` |
| Zig / Nim / Julia | `.zig`, `.nim`, `.jl` |
| Web / Markup | `.html`, `.css`, `.scss`, `.sass`, `.less`, `.vue`, `.svelte` |
| Config / Data | `.json`, `.yaml`, `.yml`, `.toml`, `.xml`, `.graphql`, `.gql` |
| SQL | `.sql` |
| Markdown | `.md`, `.mdx` |

The analyzer automatically skips common non-source directories (`node_modules`, `dist`, `build`, `.git`, `target`, `.venv`, `coverage`, etc.).

### Ask User Tool

The `ask_user` tool allows the AI to interactively ask you questions during tool execution. It supports three input types:

- **`text`** — Free-form text input
- **`select`** — Choose from a list of options
- **`confirm`** — Yes/no confirmation

This enables the AI to request clarification or confirmation before performing ambiguous or destructive operations.

## 🏗️ Architecture

```
src/
├── api/          # OpenRouter API client and types
├── core/         # Core conversation logic and message loop
├── lib/          # Shared libraries (AST file analysis)
├── tools/        # Tool implementations (bash, read, write, edit, glob, grep, analyze, ask_user)
├── ui/           # React/Ink UI components (REPL, MessageList, TextInput)
└── utils/        # Utility functions (colors, config, max tokens)
```

### Components

1. **API Layer** (`api/`)
   - `client.ts` — Streaming chat completion client for OpenRouter
   - `types.ts` — TypeScript definitions for chat messages and tool calls

2. **Core Logic** (`core/`)
   - `messageLoop.ts` — Orchestrates multi-turn conversations with tool execution
   - `systemPrompt.ts` — Generates context-aware system prompts
   - `toolExecutor.ts` — Executes tool calls and handles results
   - `query.ts` — Conversation state management

3. **Tool System** (`tools/`)
   - `bash.ts` — Execute shell commands with timeout support
   - `read.ts` — Read files with line numbers and pagination
   - `write.ts` — Create or overwrite files with directory creation
   - `edit.ts` — Replace exact string matches in files
   - `glob.ts` — Find files matching glob patterns
   - `grep.ts` — Search file contents using regex (ripgrep/grep)
   - `analyzeFile.ts` — AST-based code structure analysis
   - `askUser.ts` — Interactive user prompts during tool execution

4. **Shared Libraries** (`lib/`)
   - `files.ts` — AST parsing and file structure analysis using ts-morph

5. **UI Layer** (`ui/`)
   - `REPL.tsx` — Main REPL component with state management
   - `MessageList.tsx` — Displays conversation history with streaming
   - `TextInput.tsx` — User input component
   - `ToolResult.tsx` — Formatted tool execution results
   - `AskUserPrompt.tsx` — Interactive prompt component for AI-initiated questions
   - `AskSystemMessage.tsx` — System message prompts (model change, max tokens)
   - `SelectInput.tsx` — Selection input for multi-choice prompts

6. **Utilities** (`utils/`)
   - `colors.ts` — Color formatting helpers
   - `generateConfig.ts` — Interactive first-run configuration wizard
   - `getConfig.ts` — Reads saved configuration from `.shellmate/keys.txt`
   - `getMaxTokensConfig.ts` — Reads max tokens setting from `.shellmate/maxtokens.txt`
   - `askUserBridge.ts` — Bridge between ask_user tool and UI layer

## 📚 How It Works

```
User Message → AI Response (with tool calls)
                   ↓
            Execute Tools Locally
                   ↓
            Results → AI (next turn)
                   ↓
         Final Response to User
```

1. **User Input** — You type a message in the terminal REPL
2. **API Request** — The message is sent to OpenRouter with available tools and system context
3. **Streaming Response** — The AI response streams token-by-token to the UI
4. **Tool Execution** — If the AI calls tools, they execute locally and results are displayed
5. **Continuation** — Results are fed back to the AI for additional turns until completion

## 🔧 Configuration

### The `.shellmate` Directory

All ShellMate configuration is stored in a `.shellmate/` directory in your project root. This directory is created automatically on first run.

```
.shellmate/
├── keys.txt          # AI model and API key
└── maxtokens.txt     # Max tokens per response
```

#### `keys.txt`

Stores your AI model and OpenRouter API key:

```
AI_MODEL=anthropic/claude-sonnet-4
API_KEY=sk-or-v1-your-api-key-here
```

#### `maxtokens.txt`

Controls the maximum number of tokens the AI can generate per response:

```
MAX_TOKENS=2000
```

If this file doesn't exist, the default is **2000 tokens**.

### Model Selection

ShellMate supports any model available on [OpenRouter](https://openrouter.ai/models).

**Override per-session via CLI:**

```bash
# Claude models
shellmate --model anthropic/claude-sonnet-4
shellmate --model anthropic/claude-3.5-sonnet

# OpenAI models
shellmate --model openai/gpt-4-turbo
shellmate --model openai/gpt-4o

# Other models
shellmate --model google/gemini-pro
shellmate --model meta-llama/llama-3-70b
```

### Live Model Switching (`/change-model`)

You can switch your AI model and API key without leaving the REPL:

1. Type `/change-model` in the REPL
2. Enter the new model identifier (e.g., `openai/gpt-4o`)
3. Enter your OpenRouter API key
4. The new configuration is saved to `.shellmate/keys.txt`

> **Note:** The model change takes effect on the next session restart.

### Max Tokens Configuration (`/maxtokens`)

Control how long responses can be:

1. Type `/maxtokens` in the REPL
2. Enter the maximum number of tokens per response
3. The setting is saved to `.shellmate/maxtokens.txt`

This is useful for controlling cost and response length — lower values produce shorter, cheaper responses; higher values allow for more detailed output.

### Reconfiguring

To fully reset your configuration, delete the `.shellmate` directory and run ShellMate again:

```bash
rm -rf .shellmate
shellmate
```

Or use the REPL commands `/change-model` and `/maxtokens` to update individual settings without restarting.

### Technology Stack

- **Runtime**: Node.js with ES Modules
- **Language**: TypeScript
- **UI Framework**: React with Ink (terminal UI)
- **CLI Framework**: Commander.js
- **Validation**: Zod with JSON Schema generation
- **AST Parsing**: ts-morph (TypeScript Compiler API)
- **API**: OpenRouter (streaming chat completions)
- **Utilities**: Chalk, glob

## 🧪 Development

```bash
# Run in development mode (hot reload)
npm run dev

# Build TypeScript
npm run build

# Type checking
npx tsc --noEmit
```

## 📝 Project Structure

```
shellmate/
├── src/
│   ├── api/                  # API client and types
│   │   ├── client.ts         # OpenRouter streaming client
│   │   └── types.ts          # Chat and tool types
│   ├── core/                 # Core conversation logic
│   │   ├── messageLoop.ts    # Multi-turn conversation orchestration
│   │   ├── systemPrompt.ts   # System prompt generation
│   │   ├── toolExecutor.ts   # Tool execution engine
│   │   └── query.ts          # Conversation state
│   ├── lib/                  # Shared libraries
│   │   └── files.ts          # AST file analysis engine
│   ├── tools/                # Tool implementations
│   │   ├── analyzeFile.ts    # AST code structure analyzer
│   │   ├── askUser.ts        # Interactive user prompts
│   │   ├── bash.ts           # Shell command execution
│   │   ├── edit.ts           # String replacement editing
│   │   ├── glob.ts           # File pattern matching
│   │   ├── grep.ts           # Content search
│   │   ├── read.ts           # File reading
│   │   ├── write.ts          # File creation/overwriting
│   │   ├── types.ts          # Tool type definitions
│   │   └── index.ts          # Tool registry
│   ├── ui/                   # Terminal UI components
│   │   ├── App.tsx           # Main app component
│   │   ├── REPL.tsx          # REPL logic and state
│   │   └── components/       # UI subcomponents
│   │       ├── AskSystemMessage.tsx  # System prompts (model/tokens)
│   │       ├── AskUserPrompt.tsx     # AI-initiated user prompts
│   │       ├── MessageList.tsx       # Conversation display
│   │       ├── SelectInput.tsx       # Multi-choice selection
│   │       ├── TextInput.tsx         # Text input component
│   │       ├── ToolResult.tsx        # Tool result formatting
│   │       └── WelcomeScreen.tsx     # Welcome display
│   │   └── lib/
│   │       └── shortcuts.ts  # REPL command handlers
│   ├── utils/                # Utilities
│   │   ├── askUserBridge.ts  # Tool-to-UI bridge for ask_user
│   │   ├── colors.ts         # Color formatting
│   │   ├── generateConfig.ts # First-run config wizard
│   │   ├── getConfig.ts      # Config reader (.shellmate/keys.txt)
│   │   └── getMaxTokensConfig.ts  # Max tokens reader
│   ├── index.ts              # CLI entry point
│   └── main.ts               # Commander CLI setup
├── .shellmate/               # Configuration directory (auto-created)
│   ├── keys.txt              # AI_MODEL and API_KEY
│   └── maxtokens.txt         # MAX_TOKENS setting
├── package.json
└── tsconfig.json
```

## 🔐 Security

- API keys are configured on first run and stored locally in `.shellmate/keys.txt`
- The `.shellmate/` directory should be added to your `.gitignore`
- No keys are hardcoded or committed to version control
- Tool execution happens in the current directory context
- The `write` tool prompts for confirmation before overwriting existing files
- No automatic file uploads or external data sharing

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Add new tools to the `src/tools/` directory
- Enhance the UI components
- Improve the system prompt
- Add support for different AI providers
- Experiment with different conversation strategies

## 📖 Learning Resources

This project demonstrates several key concepts in building AI-powered CLI tools:

- **Streaming AI Responses** — Server-Sent Events (SSE) parsing and token streaming
- **Tool/Function Calling** — OpenAI-compatible tool definitions and execution
- **Terminal UI** — Building interactive CLIs with React and Ink
- **Conversation Management** — Multi-turn conversations with tool integration
- **AST Parsing** — Using ts-morph to analyze code structure programmatically
- **Tool-to-UI Communication** — Bridge pattern for interactive tool prompts
- **Type Safety** — End-to-end TypeScript with Zod validation

## 🐛 Known Limitations

- No async/background command support
- No file watching or hot reload
- Limited context window management
- No multi-session/multi-file diffs
- Basic error handling without retries
- No conversation history persistence
- Single-threaded tool execution
- Model change via `/change-model` requires REPL restart to take effect

See [FEATURES_COMPARISON.md](./dev-docs/FEATURES_COMPARISON.md) for a detailed feature comparison.

## 📄 License

MIT License — Feel free to use this for learning, experimentation, and building your own tools.

## 🙏 Acknowledgments

Inspired by the architectures of:
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** — Anthropic's AI coding assistant
- **[GitHub Copilot CLI](https://githubnext.com/projects/copilot-cli)** — GitHub's terminal AI helper
- **[Warp AI](https://www.warp.dev/)** — AI-integrated terminal emulator

## 📧 Contact

Built by **Ram Krishna Yadav** — [GitHub](https://github.com/imramkrishna)

---

> **Note**: This is an educational project. For production use, consider the official tools like GitHub Copilot CLI or Claude Code.
