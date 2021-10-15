// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const LCUConnector = require('lcu-connector')
const connector = new LCUConnector()
const fetch = require("node-fetch")
const fs = require("fs")

let auth = {}

let config = {}

const get = (endpoint) => {
        return new Promise(function(resolve, reject) {
                    resolve(fetch(`${auth.protocol}://${auth.address}:${auth.port}${endpoint}`, {
                                    headers: {
                                        'Accept': "application/json",
                                        'Authorization': `Basic ${Buffer.from(`${auth.username}:${auth.password}`).toString("base64")}`
                }
        })
        .then(res => res.text())
        .then(res => {
            return res === "" ? {} : JSON.parse(res);
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
        // .then(res => res.text())
        // .then(res => {
        //     return res === "" ? {} : JSON.parse(res);
        // })
        )
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
        })
        // .then(res => res.text())
        // .then(res => {
        //     return res === "" ? {} : JSON.parse(res);
        // })
        )
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
        .then(res => res.text())
        .then(res => {
            return res === "" ? {} : JSON.parse(res);
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
let t, j, m, a, s
let roles = []

const positionRoles = (first, second, id) => {

    roles.forEach(e => e.style.display = "inline-block")
    // roles.forEach(e => {
    //     //appends at the right spot, but misses the inverse
    //     if (e.id != first && document.getElementById(`lane1-${id}`).children.length > 0) {
    //         return  document.getElementById(`lane1-${id}`).children[0].remove()
    //         // e.remove()
    //     }
    //     console.log(document.getElementById(`lane2-${id}`).children.length > 0)
    //     if (e.id != second && document.getElementById(`lane2-${id}`).children.length > 0) {
    //         return document.getElementById(`lane1-${id}`).children[0].remove()
    //         // e.remove()
    //     }
    //     if (e.id == first) {
    //         document.getElementById(`lane1-${id}`).appendChild(e)
    //         return e.style.display = "inline-block"
    //     }
    //     if (e.id == second) {
    //         document.getElementById(`lane2-${id}`).appendChild(e)
    //         return e.style.display = "inline-block"
    //     }
    // })//https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-champ-select/global/default/images/champion-bench/moreinfo4k_default.png
    // console.log(document.getElementById(`lane1-${id}`).children[0], document.getElementById(`lane2-${id}`).children[0])
    // document.getElementById(`lane1-${id}`).children[0].src = `https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-champ-select/global/default/svg/position-${first.toLowerCase()}.svg`
    // document.getElementById(`lane2-${id}`).children[0].src = `https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-champ-select/global/default/svg/position-${second.toLowerCase()}.svg`
    if (first == "FILL") second = "FILL"
    document.getElementById(`first-${id}`).src = `https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-${first.toLowerCase()}.png`
    document.getElementById(`second-${id}`).src = `https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-${second.toLowerCase()}.png`

}

const createPlayer = (name, icon, id, lvl, percent) => {
    var fieldset = document.createElement("fieldset")
    var legend = document.createElement("legend")
    var img = document.createElement("img")
    var border = document.createElement("img")
    var p = document.createElement("p")
    var lane1 = document.createElement("div")   
    var lane2 = document.createElement("div")
    var ph = document.createElement("img")
    var ph2 = document.createElement("img")

    ph.src = "bruh"
    ph2.src = "bruh"

    ph.id = `first-${id}`
    ph2.id = `second-${id}`

    ph.className = "pos"
    ph2.className = "pos"

    lane1.className = "lane"
    lane1.id = `lane1-${id}`
    lane1.appendChild(ph)

    lane2.className = "lane"
    lane2.id = `lane2-${id}`
    lane2.appendChild(ph2)

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
    fieldset.appendChild(lane1)
    fieldset.appendChild(lane2)

    fieldset.className = "player"
    fieldset.id = id

    document.getElementById("container").appendChild(fieldset)
}

let lobbyIds = []
let riotIds = []
let positions = {}

const mainMenu = () => {
    var sr = document.createElement("img")
    var ar = document.createElement("img")
    var tt = document.createElement("img")
    var sp = document.createElement("img")

    sr.src = "https://raw.communitydragon.org/11.20/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/classic_sru/img/game-select-icon-default.png"
    ar.src = "https://raw.communitydragon.org/11.20/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/aram/img/game-select-icon-default.png"
    tt.src = "https://raw.communitydragon.org/11.20/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/tft/img/game-select-icon-default.png"
    sp.src = "https://raw.communitydragon.org/11.20/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/shared/img/icon-rgm-empty.png"

    sr.className = "game"
    ar.className = "game"
    tt.className = "game"
    sp.className = "game"

    sr.id = "sr"
    ar.id = "ar"
    tt.id = "tt"
    sp.id = "sp"

    document.getElementById("container").appendChild(sr)
    document.getElementById("container").appendChild(ar)
    document.getElementById("container").appendChild(tt)
    document.getElementById("container").appendChild(sp)
}

let menu = false

connector.on('connect', (data) => {
    console.log(data)
    auth = data

    let lobby = setInterval(() => {
        get("/lol-lobby/v2/lobby").then(res => {
            if (res.httpStatus == 404) {
                if (!menu) {
                    mainMenu()
                    lobbyIds.length = 0
                    riotIds.length = 0
                    document.getElementById("find-match").style.display = "none"
                    document.querySelectorAll(".player").forEach(e => { e.remove() })
                }
                return menu = true
            } 
            get("/lol-lobby/v2/lobby/members").then(res => {
                if (menu) {
                    document.getElementById("find-match").style.display = "block"
                }
                
                menu = false
                
                document.querySelectorAll(".game").forEach(e => { e.remove() })
                lobbyIds.forEach(id => {
                    if (!riotIds.includes(id)) {
                        lobbyIds.slice(lobbyIds.indexOf(id), 1)
                        document.getElementById(id).remove()
                    }
                })
                riotIds.length = 0
                Object.keys(res).forEach(async player => {
                    if(positions.hasOwnProperty(res[player].summonerId)) {
                        if (JSON.stringify(positions[res[player].summonerId]) !== JSON.stringify({ first: res[player].firstPositionPreference, second: res[player].secondPositionPreference })) {
                            positions[res[player].summonerId] = { first: res[player].firstPositionPreference, second: res[player].secondPositionPreference }
                            positionRoles(res[player].firstPositionPreference, res[player].secondPositionPreference, res[player].summonerId)
                        }
                    }

                    positions[res[player].summonerId] = { first: res[player].firstPositionPreference, second: res[player].secondPositionPreference }
                    riotIds.push(res[player].summonerId)
                    if (lobbyIds.includes(res[player].summonerId)) return
                    lobbyIds.push(res[player].summonerId)
                    let percent = await get(`/lol-summoner/v1/summoners/${res[player].summonerId}`).then(res2 => res2.percentCompleteForNextLevel)
                    console.log(positions)
                    createPlayer(res[player].isLeader ? res[player].summonerName + "👑" : res[player].summonerName, res[player].summonerIconId, res[player].summonerId, res[player].summonerLevel, percent)
                    positionRoles(res[player].firstPositionPreference, res[player].secondPositionPreference, res[player].summonerId)
                })
            })
        })
        
    }, 1000)
    
    // init roles
    t = document.createElement("img")
    j = document.createElement("img")
    m = document.createElement("img")
    a = document.createElement("img")
    s = document.createElement("img")

    t.src = "https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-champ-select/global/default/svg/position-top.svg"
    j.src = "https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-champ-select/global/default/svg/position-jungle.svg"
    m.src = "https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-champ-select/global/default/svg/position-middle.svg"
    a.src = "https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-champ-select/global/default/svg/position-bottom.svg"
    s.src = "https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-champ-select/global/default/svg/position-utility.svg"

    t.id = "TOP"
    j.id = "JUNGLE"
    m.id = "MIDDLE"
    a.id = "BOTTOM"
    s.id = "UTILITY"

    t.className = "pos"
    j.className = "pos"
    m.className = "pos"
    a.className = "pos"
    s.className = "pos"

    roles = [t, j, m, a, s]
    

    document.getElementById("container").style.display = "flex"
    document.getElementById("waiting").style.display = "none"
    const node = document.getElementById("window")
    node.replaceWith(...node.childNodes);
    document.getElementById("waiting").remove()

    document.getElementById("find-match").addEventListener("click", e => {
        post("/lol-lobby/v2/lobby/matchmaking/search").then(res => {
            // console.log(res)
            if (!stat(res)) return
            //console.log("bruh")
            document.getElementById("cancel").style.display = "block"
            document.getElementById("find-match").style.display = "none"
        })
    })

    document.getElementById("cancel").addEventListener("click", e => {
        del("/lol-lobby/v2/lobby/matchmaking/search").then(res => {
            // console.log(res)
            if (!stat(res)) return
            document.getElementById("find-match").style.display = "block"
            document.getElementById("cancel").style.display = "none"
        })
    })
})

const stat = (res) => {
    console.log(res.status)
    return ((res.status == 204 || res.status == 201) ? true : false);
}

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

const saveConfig = () => {
    fs.writeFile("config.json", config)
}

const loadConfig = () => {
    if (!fs.exists("config.json")) fs.writeFile("config.json", "")
    fs.readFile("config.json", (err, data) => {
        if (err) return err
        config = JSON.parse(data)
    })
}