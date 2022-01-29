const fs = require('fs')
const client = require('discord-rich-presence')('936296341250904065')
const { spawnSync, spawn, execSync, exec } = require('child_process')
var StringDecoder = require('string_decoder').StringDecoder
const { stdout, mainModule } = require('process')

let currentProject
let pastProject = ""
let cmd = 'tasklist /fi "imagename eq Cinema 4D.exe" /fo list /v'
//Loads DRC settings
let DRCSettings = JSON.parse(fs.readFileSync("DRCSettings.json"))
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function isCinemaOpen() {
    return new Promise((resolve) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err || stderr) {
                resolve("true")
                return
            }
            if (stdout.includes("No tasks")) {
                resolve("false")
                return
            }
            if (stdout.includes("Cinema 4D")) {
                //if window title is the actual project title(hover tooltips change window title to tooltip),
                //resolves to Project file name from Process dump from.bat file
                resolve(stdout)
                return
            }
            else {
                resolve("true")
                return
            }
        })
    })
}

function setDRCProject() {
    //update current presence settings
    if (currentProject !== pastProject) {
        client.updatePresence({
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
    let str
    while (true) {
        str = await isCinemaOpen()
        console.log(str)
        if (str == "false") {
            break
        }
        else if (str == "true") {
            setDRCProject()
            await sleep(DRCSettings.scan_refresh_rate)
        }
        else {
            //gets project file name
            str = str.split("\n")
            str = str[9].split("[")
            str = str[1].split("]")
            currentProject = str[0].toString()
            setDRCProject()
            await sleep(DRCSettings.scan_refresh_rate)
        }
    }
}

main()