#!/usr/bin/env node
import { createCLI } from "./main.js";
const cli = await createCLI();
cli.parse();
