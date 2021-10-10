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

const createPlayer = (name, icon) => {
    var fieldset = document.createElement("fieldset")
    var legend = document.createElement("legend")
    var img = document.createElement("img")
    img.src = `http://ddragon.leagueoflegends.com/cdn/10.18.1/img/profileicon/${icon}.png`
    legend.innerHTML = name
    fieldset.appendChild(legend)
    fieldset.appendChild(img)
    fieldset.className = "player"
    document.getElementById("container").appendChild(fieldset)
}

let lobbyIds = []

connector.on('connect', (data) => {
    console.log(data)
    auth = data

    //lobby event
    setInterval(() => {
        get("/lol-lobby/v2/comms/members").then(res => {
            Object.keys(res.players).forEach(player => {
                if (!lobbyIds.includes(res.players[player].summonerId)) {
                    get(`/lol-summoner/v1/summoners/${res.players[player].summonerId}`).then(res2 => {
                        lobbyIds.push(res.players[player].summonerId)
                        createPlayer(res.players[player].displayName, res2.profileIconId)
                    })
                }
            })
        })
        
    }, 1000) 

        // {
        //   accountId: 2713467472864992,
        //   displayName: 'yurms',
        //   internalName: 'yurms',
        //   nameChangeFlag: false,
        //   percentCompleteForNextLevel: 20,
        //   profileIconId: 1637,
        //   puuid: '8740b9d7-8b79-584d-b8ea-83a4a3d407bd',
        //   rerollPoints: {
        //     currentPoints: 292,
        //     maxRolls: 2,
        //     numberOfRolls: 1,
        //     pointsCostToRoll: 250,
        //     pointsToReroll: 208
        //   },
        //   summonerId: 2713467472864992,
        //   summonerLevel: 39,
        //   unnamed: false,
        //   xpSinceLastLevel: 634,
        //   xpUntilNextLevel: 3072
        // }
        //  {  
        //    address: '127.0.0.1'
        //    port: 18633, 
        //    username: 'riot',
        //    password: H9y4kOYVkmjWu_5mVIg1qQ,
        //    protocol: 'https'
        //  }

    //   {
    //     gameName: 'RobJobs',
    //     gameTag: 'Riven',
    //     id: 'd05b035d-047c-5e8e-bf31-2f6eb27007c2@na1.pvp.net',
    //     inviterId: '',
    //     isMuted: false,
    //     lastMessage: {
    //       body: '.',
    //       fromId: '8740b9d7-8b79-584d-b8ea-83a4a3d407bd@na1.pvp.net',
    //       fromPid: '8740b9d7-8b79-584d-b8ea-83a4a3d407bd@na1.pvp.net',
    //       fromSummonerId: 2713467472864992,
    //       id: '1633753356968:89',
    //       isHistorical: true,
    //       timestamp: '2021-10-09T04:22:36.968Z',
    //       type: 'chat'
    //     },
    //     name: 'FlyingPig014',
    //     password: '',
    //     pid: 'd05b035d-047c-5e8e-bf31-2f6eb27007c2@na1.pvp.net',
    //     targetRegion: 'na1',
    //     type: 'chat',
    //     unreadMessageCount: 0
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
    //   },
    // get("/lol-summoner/v1/current-summoner/autofill").then(res => {
    //     console.log(res)
    // })
})

// Start listening for the LCU client
connector.start();

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})

const io = require('socket.io-client');
const socket = io(`http://localhost:${process.env.SOCKET_PORT}`);

socket.on('welcome', () => {
    console.log('on welcome : welcome received renderer'); // displayed
    socket.emit('test')
});
socket.on('error', (e) => {
    console.log(e); // not displayed
});
socket.on('ok', () => {
    console.log("OK received renderer"); // not displayed
});
socket.on('connect', () => {
    console.log("connected renderer"); // displayed
    socket.emit('test');
});