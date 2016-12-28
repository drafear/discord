'use strict';

const g = {
    sleep: require('promise.sleep'),
    settings: require('./settings.js'),
    os: require('os'),
};

exports.getLocalAddress = (priority) => {
    const ifacesObj = {
        ipv4: [],
        ipv6: [],
    };
    const interfaces = g.os.networkInterfaces();
    for (const dev in interfaces) {
        interfaces[dev].forEach((details) => {
            if (!details.internal) {
                switch (details.family) {
                case "IPv4":
                    ifacesObj.ipv4.push({name:dev, address:details.address});
                    break;
                case "IPv6":
                    ifacesObj.ipv6.push({name:dev, address:details.address});
                    break;
                }
            }
        });
    }
    if (priority !== undefined) {
        const convert = (iface) => {
            for (const network_name of priority) {
                for (const network of iface) {
                    if (network.name === network_name) {
                        return network;
                    }
                }
            }
            if (iface.length == 0) return null;
            return iface[0];
        }
        for (const key in ifacesObj) {
            ifacesObj[key] = convert(ifacesObj[key]);
        }
    }
    return ifacesObj;
};
exports.gc = () => {
    if ("gc" in global) {
        global.gc();
    }
    return process.memoryUsage().heapUsed;
};
exports.sleep = (ms) => {
    return () => {
        return g.sleep(ms);
    }
};
const toString = (...objs) => {
    return objs.map((obj) => {
        return JSON.stringify(obj).replace(/^"(.*)"$/, "$1");
    }).join(" ");
}
exports.log = (client, ...msgs) => {
    console.log.apply(null, msgs);
    const msg = toString.apply(null, msgs);
    client.getTextChannel(g.settings.isTest ? "test" : "botlog").sendMessage(msg);
};
exports.error = (client, ...errors) => {
    console.error.apply(null, errors);
    const msg = toString.apply(null, errors);
    client.getTextChannel(g.settings.isTest ? "test" : "botlog").sendMessage(`\`${msg}\``);
};