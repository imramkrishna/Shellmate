import chalk from "chalk";

export const colors = {
  // ── Brand accent (warm terra-cotta) ─────────
  primary: chalk.hex("#D4845A"),
  secondary: chalk.hex("#E8A87C"),
  accent: chalk.hex("#D4845A"),
  accentBold: chalk.hex("#D4845A").bold,

  // ── Status ──────────────────────────────────
  success: chalk.hex("#4ADE80"),
  error: chalk.hex("#EF4444"),
  warning: chalk.hex("#FBBF24"),

  // ── Text ────────────────────────────────────
  muted: chalk.hex("#6B7280"),
  dim: chalk.dim,
  white: chalk.hex("#E5E7EB"),
  bright: chalk.hex("#F9FAFB").bold,

  // ── UI elements ─────────────────────────────
  toolName: chalk.hex("#FBBF24").bold,
  fileName: chalk.hex("#60A5FA"),
  lineNumber: chalk.hex("#6B7280"),

  // ── Interactive ─────────────────────────────
  prompt: chalk.bold,
  header: chalk.hex("#D4845A").bold,
  border: chalk.hex("#D4845A"),
  borderDim: chalk.hex("#4B5563"),
  highlight: chalk.hex("#D4845A").bold.underline,

  // ── Code / blocks ──────────────────────────
  blockBorder: chalk.hex("#374151"),
  blockBg: chalk.bgHex("#1F2937"),
  label: chalk.hex("#9CA3AF"),
  cyan: chalk.hex("#22D3EE"),
};
