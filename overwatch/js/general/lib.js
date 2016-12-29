'use strict';

const g = {
    sleep: require('promise.sleep'),
    settings: require('./settings.js'),
};

exports.gc = () => {
    if ("gc" in global) {
        global.gc();
    }
    return process.memoryUsage().heapUsed;
};
exports.sleep = (ms) => {
    return () => {
        return g.sleep(Math.round(ms));
    }
};
const toString = (...objs) => {
    return objs.map((obj) => {
        return JSON.stringify(obj).replace(/^"(.*)"$/, "$1");
    }).join(" ");
}
exports.log = (client, ...msgs) => {
    console.log.apply(null, msgs);
    if (client.isLogin) {
        const msg = toString.apply(null, msgs);
        client.getTextChannel(g.settings.isTest ? "test" : "botlog").sendMessage(msg);
    }
};
exports.error = (client, ...errors) => {
    console.error.apply(null, errors);
    if (client.isLogin) {
        const msg = toString.apply(null, errors);
        client.getTextChannel(g.settings.isTest ? "test" : "botlog").sendMessage(`\`${msg}\``);
    }
};