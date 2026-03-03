#!/usr/bin/env node
import { createCLI } from "./main.js";
import dotenv from "dotenv";
dotenv.config();
let model=process.env.AI_MODEL;
if(!model){
    throw new Error("The AI_MODEL is missing. Make sure to select the ai model.")
}
createCLI().parse();
