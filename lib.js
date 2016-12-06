'use strict';

const global = {
    sleep: require('promise.sleep'),
};

exports.sleep = (ms) => {
    return () => {
        return global.sleep(ms);
    }
};
exports.log = (client, ...msgs) => {
    console.log.apply(null, msgs);
    client.getTextChannel("botlog").sendMessage(JSON.stringify.apply(null, msgs));
};
exports.error = (client, ...errors) => {
    console.error.apply(null, errors);
    client.getTextChannel("botlog").sendMessage(`\`${JSON.stringify.apply(null, msgs)}\``);
};
