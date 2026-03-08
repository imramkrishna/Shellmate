import React from "react";
import { Box, Text, useStdout } from "ink";
import chalk from "chalk";

// ── ANSI-aware string helpers ────────────────────────────────

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\u001b\[[0-9;]*m/g, "");
}

function visLen(str: string): number {
  return stripAnsi(str).length;
}

function rpad(str: string, width: number): string {
  const diff = width - visLen(str);
  return diff > 0 ? str + " ".repeat(diff) : str;
}

function dashedLine(len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) s += i % 2 === 0 ? "-" : " ";
  return s;
}

// ── Theme tokens ─────────────────────────────────────────────

const ac = chalk.hex("#D4845A"); // accent
const ab = chalk.hex("#D4845A").bold; // accent bold
const dm = chalk.dim; // dim / muted
const gr = chalk.hex("#4ADE80"); // green

// ── Mascot art ───────────────────────────────────────────────

function buildMascot(): string[] {
  return [
    ac("      ╔═══════╗"),
    ac("      ║") + chalk.hex("#E8A87C")(" ■") + "   " + chalk.hex("#E8A87C")("■ ") + ac("║"),
    ac("      ║") + chalk.hex("#E8A87C")("  ╲_╱  ") + ac("║"),
    ac("      ╚") + ac("══╤═╤══") + ac("╝"),
    ac("        ┘   └"),
  ];
}

// ── Format model name ────────────────────────────────────────

function formatModel(model: string): string {
  const name = model.split("/").pop() || model;
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Component ────────────────────────────────────────────────

interface WelcomeScreenProps {
  model: string;
  version?: string;
}

export function WelcomeScreen({
  model,
  version = "1.0.6",
}: WelcomeScreenProps) {
  const { stdout } = useStdout();
  const termW = stdout?.columns || 80;
  const W = Math.max(56, Math.min(termW - 4, 80)); // total box width
  const inner = W - 3; // usable cols (3 border chars: | left | right |)
  const lw = Math.floor(inner * 0.42); // left column width (narrower)
  const rw = inner - lw; // right column width (wider)

  const cwd = process.cwd().replace(process.env.HOME || "", "~");
  const title = ` ShellMate v${version} `;
  const modelName = formatModel(model);
  const mascot = buildMascot();

  // ── Left column content ──────────────────────

  const left: string[] = [
    "",
    "    " + chalk.bold("Welcome!"),
    "",
    ...mascot.map((l) => "  " + l),
    "",
    "    " + dm(modelName),
    "    " + dm(cwd),
  ];

  // ── Right column content ─────────────────────
  // Section 1: Quick commands
  const right: string[] = [
    " " + ab("Quick commands"),
    " " + dm("/help") + "      Show all commands",
    " " + dm("/change-model") + "     Change AI model",
    " " + dm("/maxtokens") + "     Change Max Tokens per Request",
    " " + ac(dashedLine(Math.max(0, rw - 2))),
    " " + ab("What's new"),
    " Multi-tool execution",
    " File editing & creation",
    " " + dm("...  /help for more"),
  ];

  // ── Assemble box lines ───────────────────────

  const rows = Math.max(left.length, right.length);
  const lines: string[] = [];

  // Top border with embedded title (dashed)
  const topDash = Math.max(0, W - 3 - title.length);
  lines.push(ac(".- ") + ab(title) + ac(dashedLine(topDash) + "."));

  // Empty padding row
  lines.push(ac(":") + " ".repeat(lw) + ac(":") + " ".repeat(rw) + ac(":"));

  // Content rows
  for (let i = 0; i < rows; i++) {
    const l = left[i] ?? "";
    const r = right[i] ?? "";
    lines.push(
      ac(":") + rpad(l, lw) + ac(":") + rpad(r, rw) + ac(":")
    );
  }

  // Empty padding row
  lines.push(ac(":") + " ".repeat(lw) + ac(":") + " ".repeat(rw) + ac(":"));

  // Bottom border (dashed)
  lines.push(ac("'" + dashedLine(lw) + "┴" + dashedLine(rw) + "'"));

  return (
    <Box marginBottom={1} marginLeft={1}>
      <Text>{lines.join("\n")}</Text>
    </Box>
  );
}
