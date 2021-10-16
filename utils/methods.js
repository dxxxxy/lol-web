const fetch = require("node-fetch")

const get = (endpoint) => {
    return new Promise(function(resolve, reject) {
        resolve(fetch(`${window.auth.protocol}://${window.auth.address}:${window.auth.port}${endpoint}`, {
                headers: {
                    'Accept': "application/json",
                    'Authorization': `Basic ${Buffer.from(`${window.auth.username}:${window.auth.password}`).toString("base64")}`
                },
            })
            .then(res => res.text())
            .then(res => {
                return res === "" ? {} : JSON.parse(res);
            })
        )
    })
}

const post = (endpoint, body) => {
    return new Promise(function(resolve, reject) {
        resolve(fetch(`${window.auth.protocol}://${window.auth.address}:${window.auth.port}${endpoint}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${window.auth.username}:${window.auth.password}`).toString("base64")}`
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
        resolve(fetch(`${window.auth.protocol}://${window.auth.address}:${window.auth.port}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${window.auth.username}:${window.auth.password}`).toString("base64")}`
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
        resolve(fetch(`${window.auth.protocol}://${window.auth.address}:${window.auth.port}${endpoint}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${window.auth.username}:${window.auth.password}`).toString("base64")}`
                }
            })
            .then(res => res.text())
            .then(res => {
                return res === "" ? {} : JSON.parse(res);
            }))
    })
}

module.exports = {
    get,
    post,
    put,
    del
}