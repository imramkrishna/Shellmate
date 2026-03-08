import fs from "fs";
import type { UserInputRequest } from "../../utils/askUserBridge.js";

export const changeModelRequests: UserInputRequest[] = [
    { question: "Enter AI Model:", type: "text", required: true },
    { question: "Enter Open Router API Key:", type: "text", required: true },
];
export const changeMaxTokens:UserInputRequest[] = [
    { question: "Enter Maximum number of tokens you want to allow per message request : ", type: "text", required: true },
];

export function systemAction(answers: string[], systemRequestType: string | null) {
    switch (systemRequestType) {
        case null:
            break;
        case undefined:
            break;
        case "change-model":
            const [aiModel, apiKey] = answers;
            const fileContent = `AI_MODEL=${aiModel}\nAPI_KEY=${apiKey}`;
            fs.mkdirSync(".shellmate", { recursive: true });
            fs.writeFileSync(".shellmate/keys.txt", fileContent);
            break;
        case "maxtokens":
            const [maxtokens]=answers
            let maxTokensContent=`MAX_TOKENS=${maxtokens}`
            fs.writeFileSync(".shellmate/maxtokens.txt",maxTokensContent)
            break;
        default:
            return;
    }
}