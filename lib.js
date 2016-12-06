'use strict';

const global = {
    sleep: require('promise.sleep'),
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
    client.getTextChannel("botlog").sendMessage(msg);
};
exports.error = (client, ...errors) => {
    console.error.apply(null, errors);
    const msg = toString.apply(null, errors);
    client.getTextChannel("botlog").sendMessage(`\`${msg}\``);
};
