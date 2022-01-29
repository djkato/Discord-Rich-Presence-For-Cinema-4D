const fs = require('fs')
const client = require('discord-rich-presence')
const { spawnSync, spawn, execSync, exec } = require('child_process')
var StringDecoder = require('string_decoder').StringDecoder
const { stdout, mainModule } = require('process')

let currentProject = "lorem Ipsum"
let pastProject = "."
let cmd = 'tasklist /fi "imagename eq Cinema 4D.exe" /fo list /v'
//Loads DRC settings
let DRCSettings = JSON.parse(fs.readFileSync("DRCSettings.json"))

let currentClient
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function getCinemaProcessInfo() {
    return new Promise((resolve) => {
        exec(cmd, (err, stdout, stderr) => {
            resolve(stdout)
        })
    })
}

function updateOpenProjectName(str) {
    if (str.includes("No tasks")) {
        currentProject = false
        return
    }
    str = str.split("Window Title:")
    if (str[1].includes("Cinema 4D")) {
        str = str[1].split("[")
        str = str[1].split("]")
        if (str[0].includes("*")) {
            str = str[0].substring(0, str[0].length - 2)
            console.log(str)
            currentProject = str.toString()
        }
        else {
            console.log(str[0])
            currentProject = str[0].toString()
        }
    }
}

function setDRCProject() {
    //update current presence settings
    if (currentProject != pastProject) {
        currentClient.updatePresence({
            state: `Porfolio: ${DRCSettings.portfolio_website}`,
            details: `Working on ${currentProject}`,
            startTimestamp: Date.now(),
            largeImageKey: 'c4d',
            instance: true,
        })
    }
    pastProject = currentProject

}

async function main() {
    while (true) {
        updateOpenProjectName(await getCinemaProcessInfo())
        //stops DRC when broken
        if (currentProject == false) {
            if (currentClient) {
                await currentClient.disconnect()
            }
            await sleep(20000)
            continue
        } else {
            if (!currentClient) {
                currentClient = client("936296341250904065")
            }
            setDRCProject()
        }
        await sleep(DRCSettings.scan_refresh_rate)
    }
}

main()