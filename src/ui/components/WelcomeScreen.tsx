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

// ── Theme tokens ─────────────────────────────────────────────

const ac = chalk.hex("#D4845A"); // accent
const ab = chalk.hex("#D4845A").bold; // accent bold
const dm = chalk.dim; // dim / muted
const gr = chalk.hex("#4ADE80"); // green

// ── Mascot art ───────────────────────────────────────────────

function buildMascot(): string[] {
  return [
    ac("     ╔═════════╗"),
    ac("     ║") + "  •   •  " + ac("║"),
    ac("     ║   ") + gr(">_") + ac("    ║"),
    ac("     ╚═════════╝"),
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
  version = "1.0.0",
}: WelcomeScreenProps) {
  const { stdout } = useStdout();
  const termW = stdout?.columns || 80;
  const W = Math.max(50, Math.min(termW - 2, 76)); // total box width
  const inner = W - 3; // usable cols (3 vertical bars: │ left │ right │)
  const lw = Math.floor(inner / 2); // left column width
  const rw = inner - lw; // right column width

  const cwd = process.cwd().replace(process.env.HOME || "", "~");
  const title = ` ShellMate v${version} `;
  const modelName = formatModel(model);
  const mascot = buildMascot();

  // ── Left column content ──────────────────────

  const left: string[] = [
    "  " + chalk.bold("Welcome!"),
    "",
    ...mascot.map((l) => "  " + l),
    "",
    "  " + dm(modelName),
    "  " + dm(cwd),
  ];

  // ── Right column content ─────────────────────

  const right: string[] = [
    " " + ab("Tips for getting started"),
    " Ask ShellMate to create a new",
    " app or clone a repository",
    " " + ac("─".repeat(Math.max(0, rw - 2))),
    " " + ab("Recent activity"),
    " " + dm("No recent activity"),
  ];

  // ── Assemble box lines ───────────────────────

  const rows = Math.max(left.length, right.length);
  const lines: string[] = [];

  // Top border with embedded title
  const topDash = Math.max(0, W - 3 - title.length);
  lines.push(ac("╭─") + ab(title) + ac("─".repeat(topDash) + "╮"));

  // Empty padding row
  lines.push(ac("│") + " ".repeat(lw) + ac("│") + " ".repeat(rw) + ac("│"));

  // Content rows
  for (let i = 0; i < rows; i++) {
    const l = left[i] ?? "";
    const r = right[i] ?? "";
    lines.push(
      ac("│") + rpad(l, lw) + ac("│") + rpad(r, rw) + ac("│")
    );
  }

  // Empty padding row
  lines.push(ac("│") + " ".repeat(lw) + ac("│") + " ".repeat(rw) + ac("│"));

  // Bottom border with junction
  lines.push(ac("╰" + "─".repeat(lw) + "┴" + "─".repeat(rw) + "╯"));

  return (
    <Box marginBottom={1} marginLeft={1}>
      <Text>{lines.join("\n")}</Text>
    </Box>
  );
}
