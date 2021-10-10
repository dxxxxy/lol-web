// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const LCUConnector = require('lcu-connector')
const connector = new LCUConnector()
const fetch = require("node-fetch")

let auth = {}

const get = (endpoint) => {
        return new Promise(function(resolve, reject) {
                    resolve(fetch(`${auth.protocol}://${auth.address}:${auth.port}${endpoint}`, {
                                    headers: {
                                        'Accept': "application/json",
                                        'Authorization': `Basic ${Buffer.from(`${auth.username}:${auth.password}`).toString("base64")}`
                }
            })
            .then(res => res.json())
            .then(res => {
                return res
            }))
    })
}

const post = (endpoint, body) => {
    return new Promise(function(resolve, reject) {
        resolve(fetch(`${auth.protocol}://${auth.address}:${auth.port}${endpoint}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${auth.username}:${auth.password}`).toString("base64")}`
                }
            })
            .then(res => res.json())
            .then(res => {
                return res
            }))
    })
}

const del = (endpoint) => {
    return new Promise(function(resolve, reject) {
        resolve(fetch(`${auth.protocol}://${auth.address}:${auth.port}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${auth.username}:${auth.password}`).toString("base64")}`
            }
        }))
    })
}

const put = (endpoint, body) => {
    return new Promise(function(resolve, reject) {
        resolve(fetch(`${auth.protocol}://${auth.address}:${auth.port}${endpoint}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${auth.username}:${auth.password}`).toString("base64")}`
                }
            })
            .then(res => res.json())
            .then(res => {
                return res
            }))
    })
}

/*
{
  allowedChangeActivity: true,
  allowedInviteOthers: true,
  allowedKickOthers: true,
  allowedStartActivity: true,
  allowedToggleInvite: true,
  autoFillEligible: false,
  autoFillProtectedForPromos: false,
  autoFillProtectedForSoloing: false,
  autoFillProtectedForStreaking: true,
  botChampionId: 0,
  botDifficulty: 'NONE',
  botId: '',
  firstPositionPreference: 'UTILITY',
  isBot: false,
  isLeader: true,
  isSpectator: false,
  puuid: '8740b9d7-8b79-584d-b8ea-83a4a3d407bd',
  ready: true,
  secondPositionPreference: 'MIDDLE',
  showGhostedBanner: false,
  summonerIconId: 1637,
  summonerId: 2713467472864992,
  summonerInternalName: 'yurms',
  summonerLevel: 39,
  summonerName: 'yurms',
  teamId: 0
}
*/

const createPlayer = (name, icon, id, lvl, percent) => {
    var fieldset = document.createElement("fieldset")
    var legend = document.createElement("legend")
    var img = document.createElement("img")
    var border = document.createElement("img")
    var p = document.createElement("p")
    p.innerHTML = lvl
    border.src = `https://raw.communitydragon.org/11.20/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/prestigeborders/theme-${Math.ceil(lvl/25)}-border.png`
    border.className = "b"
    img.src = `https://raw.communitydragon.org/11.20/game/assets/ux/summonericons/profileicon${icon}.png`
    img.className = "a"
    img.style.backgroundColor = "rgba(128, 128, 128, 0.445)"
    img.style.backgroundImage = `linear-gradient(0deg, #65C178 ${percent}%, rgba(0, 0, 0, 0) ${percent}%)`
    legend.innerHTML = name
    fieldset.appendChild(legend)
    fieldset.appendChild(img)
    fieldset.appendChild(border)
    fieldset.appendChild(p)
    fieldset.className = "player"
    fieldset.id = id
    document.getElementById("container").appendChild(fieldset)
}

let lobbyIds = []
let riotIds = []

connector.on('connect', (data) => {
    console.log(data)
    auth = data

    //lobby event
    setInterval(() => {
        
        get("/lol-lobby/v2/lobby/members").then(res => {
            lobbyIds.forEach(id => {
                if (!riotIds.includes(id)) {
                    lobbyIds.slice(lobbyIds.indexOf(id), 1)
                    document.getElementById(id).remove()
                }
            })
            riotIds.length = 0
            Object.keys(res).forEach(async player => {
                riotIds.push(res[player].summonerId)
                if (lobbyIds.includes(res[player].summonerId)) return
                lobbyIds.push(res[player].summonerId)
                let percent = await get(`/lol-summoner/v1/summoners/${res[player].summonerId}`).then(res2 => res2.percentCompleteForNextLevel)
                createPlayer(res[player].isLeader ? res[player].summonerName + "👑" : res[player].summonerName, res[player].summonerIconId, res[player].summonerId, res[player].summonerLevel, percent)
            })
        })
    }, 1000) 

    document.getElementById("container").style.display = "flex"
    document.getElementById("waiting").style.display = "none"
    const node = document.getElementById("window")
    node.replaceWith(...node.childNodes);
    document.getElementById("waiting").remove()

    document.getElementById("find-match").addEventListener("click", e => {
        console.log("trying")
        post("/lol-lobby/v2/lobby/matchmaking/search").then(res => {
            console.log(res)
        })
        document.getElementById("cancel").style.display = "block"
        document.getElementById("cancel").style.opacity = 1
        document.getElementById("find-match").style.display = "none"
        document.getElementById("find-match").style.opacity = 0
    })

    document.getElementById("cancel").addEventListener("click", e => {
        console.log("trying2")
        del("/lol-lobby/v2/lobby/matchmaking/search").then(res => {
            console.log(res)
        })
        document.getElementById("find-match").style.display = "block"
        document.getElementById("find-match").style.opacity = 1
        document.getElementById("cancel").style.display = "none"
        document.getElementById("cancel").style.opacity = 0
    })
})

// Start listening for the LCU client
connector.start();

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("container").style.display = "none"

    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})