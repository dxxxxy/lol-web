// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
var {
    get,
    post,
    put,
    del
} = require("./utils/methods.js")

const LCUConnector = require('lcu-connector')
const connector = new LCUConnector()
const fs = require("fs")

let config = {}

// Attribute roles to players
const positionRoles = (first, second, id) => {
    if (first == "FILL") second = "FILL"
    document.getElementById(`first-${id}`).src = `https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-${first.toLowerCase()}.png`
    document.getElementById(`second-${id}`).src = `https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-${second.toLowerCase()}.png`
}

let cycles = {
    0: "UNSELECTED",
    1: "TOP",
    2: "JUNGLE",
    3: "MIDDLE",
    4: "BOTTOM",
    5: "UTILITY",
    6: "FILL"
}

let cycle1 = 0
let cycle2 = 0

// Cycle leader's roles on click
const cycleRole = (first, second, lane) => {
    cycle1 = +Object.keys(cycles).find(k => cycles[k] === first);
    cycle2 = +Object.keys(cycles).find(k => cycles[k] === second);

    if (lane == 1) {
        cycle1++
    }

    if (lane == 2) {
        cycle2++
    }

    if (cycle1 > 6) cycle1 = 0
    if (cycle2 > 6) cycle2 = 0

    put("/lol-lobby/v1/parties/metadata", {
        "positionPref": [
            cycles[cycle1],
            cycles[cycle2]
        ]
    })
}

let lobbyIds = []
let riotIds = []
let positions = {}

// Create player card
const createPlayer = (name, icon, id, lvl, percent, isLeader) => {
    var fieldset = document.createElement("fieldset")
    var legend = document.createElement("legend")
    var img = document.createElement("img")
    var border = document.createElement("img")
    var p = document.createElement("p")
    var lane1 = document.createElement("div")
    var lane2 = document.createElement("div")
    var ph = document.createElement("img")
    var ph2 = document.createElement("img")

    ph.src = "placeholder"
    ph2.src = "placeholder"

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

    if (isLeader) {
        lane1.addEventListener("click", () => {
            cycleRole(positions[id].first, positions[id].second, 1)
        })

        lane2.addEventListener("click", () => {
            cycleRole(positions[id].first, positions[id].second, 2)
        })
    }
}

// Create a main menu when not in lobby
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

// Connect to LCU event
connector.on('connect', (data) => {
    console.log(data)
    window.auth = data

    setInterval(() => {
        get("/lol-lobby/v2/lobby").then(res => {
            if (res.httpStatus == 404) {
                if (!menu) {
                    mainMenu()
                    lobbyIds.length = 0
                    riotIds.length = 0
                    document.getElementById("find-match").style.display = "none"
                    document.querySelectorAll(".player").forEach(e => {
                        e.remove()
                    })
                }
                return menu = true
            }
            get("/lol-lobby/v2/lobby/members").then(res => {
                if (menu) {
                    document.getElementById("find-match").style.display = "block"
                }

                menu = false

                document.querySelectorAll(".game").forEach(e => {
                    e.remove()
                })
                lobbyIds.forEach(id => {
                    if (!riotIds.includes(id)) {
                        lobbyIds.slice(lobbyIds.indexOf(id), 1)
                        document.getElementById(id).remove()
                    }
                })
                riotIds.length = 0
                Object.keys(res).forEach(async player => {
                    if (positions.hasOwnProperty(res[player].summonerId)) {
                        if (JSON.stringify(positions[res[player].summonerId]) !== JSON.stringify({
                                first: res[player].firstPositionPreference,
                                second: res[player].secondPositionPreference
                            })) {
                            positions[res[player].summonerId] = {
                                first: res[player].firstPositionPreference,
                                second: res[player].secondPositionPreference
                            }
                            positionRoles(res[player].firstPositionPreference, res[player].secondPositionPreference, res[player].summonerId)
                        }
                    }

                    positions[res[player].summonerId] = {
                        first: res[player].firstPositionPreference,
                        second: res[player].secondPositionPreference
                    }
                    riotIds.push(res[player].summonerId)
                    if (lobbyIds.includes(res[player].summonerId)) return
                    lobbyIds.push(res[player].summonerId)
                    let percent = await get(`/lol-summoner/v1/summoners/${res[player].summonerId}`).then(res2 => res2.percentCompleteForNextLevel)
                    console.log(positions)
                    createPlayer(res[player].isLeader ? res[player].summonerName + "👑" : res[player].summonerName, res[player].summonerIconId, res[player].summonerId, res[player].summonerLevel, percent, res[player].isLeader, res[player].firstPositionPreference, res[player].secondPositionPreference)
                    positionRoles(res[player].firstPositionPreference, res[player].secondPositionPreference, res[player].summonerId)
                })
            })
        })

    }, 1000)

    document.getElementById("container").style.display = "flex"
    document.getElementById("waiting").style.display = "none"
    const node = document.getElementById("window")
    node.replaceWith(...node.childNodes);
    document.getElementById("waiting").remove()

    document.getElementById("find-match").addEventListener("click", e => {
        post("/lol-lobby/v2/lobby/matchmaking/search").then(res => {
            if (!stat(res)) return
            document.getElementById("cancel").style.display = "block"
            document.getElementById("find-match").style.display = "none"
        })
    })

    document.getElementById("cancel").addEventListener("click", e => {
        del("/lol-lobby/v2/lobby/matchmaking/search").then(res => {
            if (!stat(res)) return
            document.getElementById("find-match").style.display = "block"
            document.getElementById("cancel").style.display = "none"
        })
    })
})

// Check if request status is ok
const stat = (res) => {
    console.log(res.status)
    return ((res.status == 204 || res.status == 201) ? true : false);
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("container").style.display = "none"
})

const saveConfig = () => {
    fs.writeFile("config.json", JSON.stringify(config), () => {
        console.log("Config saved")
    })
}

const loadConfig = () => {
    if (!fs.existsSync("config.json")) fs.writeFile("config.json", JSON.stringify(config), () => {
        console.log("Config created")
    })
    fs.readFile("config.json", (err, data) => {
        if (err) return err
        config = JSON.parse(data)
    })
}

// Start listening for the LCU client
connector.start();

// Load config
loadConfig()