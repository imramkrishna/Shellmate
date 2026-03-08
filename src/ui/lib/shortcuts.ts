import fs from "fs";
import type { UserInputRequest } from "../../utils/askUserBridge.js";

export const changeModelRequests: UserInputRequest[] = [
    { question: "Enter AI Model:", type: "text", required: true },
    { question: "Enter Open Router API Key:", type: "text", required: true },
];

export function saveModelConfig(answers: string[]) {
    const [aiModel, apiKey] = answers;
    const fileContent = `AI_MODEL=${aiModel}\nAPI_KEY=${apiKey}`;
    fs.mkdirSync(".shellmate", { recursive: true });
    fs.writeFileSync(".shellmate/keys.txt", fileContent);
}