import chalk from "chalk";

export const colors = {
  // Accent theme (warm orange/terra-cotta — matches Claude Code aesthetic)
  primary: chalk.hex("#D4845A"),
  secondary: chalk.hex("#E8A87C"),
  accent: chalk.hex("#D4845A"),
  accentBold: chalk.hex("#D4845A").bold,

  // Status
  success: chalk.hex("#4ADE80"),
  error: chalk.hex("#EF4444"),
  warning: chalk.hex("#FBBF24"),

  // Text
  muted: chalk.hex("#6B7280"),
  dim: chalk.dim,

  // UI elements
  toolName: chalk.hex("#FBBF24").bold,
  fileName: chalk.hex("#60A5FA"),
  lineNumber: chalk.hex("#6B7280"),

  // Interactive
  prompt: chalk.bold,
  header: chalk.hex("#D4845A").bold,
  border: chalk.hex("#D4845A"),
};
