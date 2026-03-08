import fs from "fs"
function getMaxTokensConfig():Map<string,number>{
    let credentials=new Map<string,number>
    let content=fs.readFileSync(".shellmate/maxtokens.txt");
    let data=content.toString().trim().split("\n")
    credentials.set("MAX_TOKENS",parseInt(data[0].split("=")[1]))
    return credentials
}
export default getMaxTokensConfig;