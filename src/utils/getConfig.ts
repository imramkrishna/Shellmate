import fs from "fs"
function getConfig():Map<string,string>{
    let credentials=new Map<string,string>
    let content=fs.readFileSync(".shellmate/keys.txt");
    let data=content.toString().trim().split("\n")
    credentials.set("AI_MODEL",data[0].split("=")[1])
    credentials.set("API_KEY",data[1].split("=")[1])
    return credentials
}
export default getConfig;