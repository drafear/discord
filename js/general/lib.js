'use strict';

const global = {
    sleep: require('promise.sleep'),
    settings: require('./settings.js'),
};

exports.sleep = (ms) => {
    return () => {
        return global.sleep(ms);
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
    client.getTextChannel(global.settings.isTest ? "test" : "botlog").sendMessage(msg);
};
exports.error = (client, ...errors) => {
    console.error.apply(null, errors);
    const msg = toString.apply(null, errors);
    client.getTextChannel(global.settings.isTest ? "test" : "botlog").sendMessage(`\`${msg}\``);
};
