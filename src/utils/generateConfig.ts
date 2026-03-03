import fs from "fs"
import readline from "readline"
function question(rl: readline.Interface, prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => resolve(answer))
    })
}

async function generateConfig() {
    if (fs.existsSync("config.txt")) {
        return;
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    console.log("Initializing ai model and API KEY")
    const AI_MODEL = await question(rl, "Enter AI_MODEL : ")
    const API_KEY = await question(rl, "Enter Open Router Api Key : ")

    const fileContent = `AI_MODEL=${AI_MODEL}\nAPI_KEY=${API_KEY}`
    fs.writeFileSync("config.txt", fileContent)
    console.log(`Configuration for ${AI_MODEL} Model Initialized!`)
    rl.close()
}

export default generateConfig