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
- 🛠️ **6 Built-in Tools** — File read/write/edit, shell commands, glob, and grep — all callable by the AI
- 🔄 **Streaming Responses** — Token-by-token output for a responsive, conversational feel
- 🎨 **Beautiful Terminal UI** — Colorized output, spinners, and a friendly welcome screen
- 🔌 **Multi-Model Support** — Use any model on OpenRouter: Claude, GPT-4, Gemini, LLaMA, and more
- ⚡ **Zero-Config Setup** — Interactive first-run wizard configures your model and API key automatically
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

This configuration is saved locally in a `config.txt` file so you only need to do it once.

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

## 🛠️ Available Tools

ShellMate provides 6 core tools that the AI can use to interact with your local environment:

| Tool | Description | Example Use Cases |
|------|-------------|-------------------|
| **bash** | Execute shell commands with timeout support | Running scripts, installing packages, git operations |
| **read** | Read file contents with line numbers and pagination | Viewing source code, inspecting config files |
| **write** | Create or overwrite files (auto-creates directories) | Generating new files, scripts, configurations |
| **edit** | Replace exact string matches in files | Precise code modifications, refactoring |
| **glob** | Find files matching glob patterns | File discovery, listing source files |
| **grep** | Search file contents using regex | Finding code patterns, TODOs, function definitions |

## 🏗️ Architecture

```
src/
├── api/          # OpenRouter API client and types
├── core/         # Core conversation logic and message loop
├── tools/        # Tool implementations (bash, read, write, edit, glob, grep)
├── ui/           # React/Ink UI components (REPL, MessageList, TextInput)
└── utils/        # Utility functions (colors, config management)
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

4. **UI Layer** (`ui/`)
   - `REPL.tsx` — Main REPL component with state management
   - `MessageList.tsx` — Displays conversation history with streaming
   - `TextInput.tsx` — User input component
   - `ToolResult.tsx` — Formatted tool execution results

5. **Utilities** (`utils/`)
   - `colors.ts` — Color formatting helpers
   - `generateConfig.ts` — Interactive first-run configuration wizard
   - `getConfig.ts` — Reads saved configuration from `config.txt`

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

### Model Selection

ShellMate supports any model available on [OpenRouter](https://openrouter.ai/models). Override your default model per-session with `--model`:

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

### Reconfiguring

To change your saved model or API key, delete the `config.txt` file and run ShellMate again:

```bash
rm config.txt
shellmate
```

### Technology Stack

- **Runtime**: Node.js with ES Modules
- **Language**: TypeScript
- **UI Framework**: React with Ink (terminal UI)
- **CLI Framework**: Commander.js
- **Validation**: Zod with JSON Schema generation
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
│   ├── tools/                # Tool implementations
│   │   ├── bash.ts           # Shell command execution
│   │   ├── read.ts           # File reading
│   │   ├── write.ts          # File creation/overwriting
│   │   ├── edit.ts           # String replacement editing
│   │   ├── glob.ts           # File pattern matching
│   │   ├── grep.ts           # Content search
│   │   └── index.ts          # Tool registry
│   ├── ui/                   # Terminal UI components
│   │   ├── App.tsx           # Main app component
│   │   ├── REPL.tsx          # REPL logic and state
│   │   └── components/       # UI subcomponents
│   ├── utils/                # Utilities
│   │   ├── colors.ts         # Color formatting
│   │   ├── generateConfig.ts # First-run config wizard
│   │   └── getConfig.ts      # Config reader
│   ├── index.ts              # CLI entry point
│   └── main.ts               # Commander CLI setup
├── package.json
└── tsconfig.json
```

## 🔐 Security

- API keys are configured on first run and stored locally in `config.txt`
- No keys are hardcoded or committed to version control
- Tool execution happens in the current directory context
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
- **Type Safety** — End-to-end TypeScript with Zod validation

## 🐛 Known Limitations

- No async/background command support
- No file watching or hot reload
- Limited context window management
- No multi-session/multi-file diffs
- Basic error handling without retries
- No conversation history persistence
- Single-threaded tool execution

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
