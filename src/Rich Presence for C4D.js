const fs = require('fs')
const client = require('discord-rich-presence')
const { spawnSync, spawn, execSync, exec } = require('child_process')
var StringDecoder = require('string_decoder').StringDecoder
const { stdout, mainModule } = require('process')

let currentProject = "lorem Ipsum"
let pastProject = "."

//Command used to scan for C4D process
let cmd = 'tasklist /fi "imagename eq Cinema 4D.exe" /fo list /v'
//Loads DRC settings
let DRCSettings
try {
    DRCSettings = JSON.parse(fs.readFileSync("DRCSettings.json"))

} catch (err) {
    DRCSettings = { "portfolio_website": "djkato.net", "scan_refresh_rate": 1000 }
    fs.writeFileSync("DRCSettings.json", JSON.stringify(DRCSettings))
}

let clientIsConnected = false
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
    //if project file found sets current project to name, else currentProject = false
    if (str.includes("No tasks")) {
        currentProject = false
        return
    }
    str = str.split("Window Title:")
    if (str[1].includes("Cinema 4D")) {
        str = str[1].split("[")
        //If for some reason the name isnt right?
        if (!str[1]) return
        str = str[1].split("]")
        if (str[0].includes("*")) {
            str = str[0].substring(0, str[0].length - 2)
            //console.log(str)
            currentProject = str.toString()
        }
        else {
            //console.log(str[0])
            currentProject = str[0].toString()
        }
    }
}

function setDRCProject() {
    //update current presence settings
    //reconnects the client if isnt connected
    if (!clientIsConnected) {
        currentClient = client("936296341250904065")

        clientIsConnected = true
        //console.log("starting client")
        currentProject = "0"
    }

    currentClient.on("error", (err) => {
        //if errored and shouldnt have, reconnect
        if (clientIsConnected && currentProject) {
            currentClient = client("936296341250904065")
            console.log("errored and reconnecting")
        } else {
            clientIsConnected = false, currentProject = false
            console.log("errored and keeping off")
        }
    })

    if (currentProject != pastProject) {
        currentClient.updatePresence({
            state: `Porfolio: ${DRCSettings.portfolio_website}`,
            details: `Working on ${currentProject}`,
            startTimestamp: Date.now(),
            largeImageKey: 'c4d',
            instance: true,
        })
        //console.log("updating client")
    }
    pastProject = currentProject

}
//catches the error

async function main() {
    while (true) {
        updateOpenProjectName(await getCinemaProcessInfo())
        //stops DRC when no project detected
        if (currentProject == false) {
            if (clientIsConnected) {
                await currentClient.disconnect()
                clientIsConnected = false
                //console.log("disconnecting client...")
            }
            await sleep(DRCSettings.scan_refresh_rate * 10)
            continue

        } else {
            setDRCProject()
        }
        await sleep(DRCSettings.scan_refresh_rate)

    }
}

main()