import fs from "fs"
import readline from "readline"
function question(rl: readline.Interface, prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => resolve(answer))
    })
}
async function generateMaxTokensConfig() {
    if (fs.existsSync(".shellmate/maxtokens.txt")) {
        return;
    }
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    let maxtokens = await question(rl, "Enter Max Tokens to be used per response : ")
    let fileContent = `MAX_TOKENS=${maxtokens}`
    fs.writeFileSync(".shellmate/maxtokens.txt", fileContent)
    console.log(`Configuration Initialized!`)
    rl.close()
}

export default generateMaxTokensConfig