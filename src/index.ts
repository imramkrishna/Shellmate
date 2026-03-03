#!/usr/bin/env node
import { createCLI } from "./main.js";
import dotenv from "dotenv";
dotenv.config();
createCLI().parse();
