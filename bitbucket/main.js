'use strict';

const g = {
    lib: require('./js/lib.js'),
    discord: require('./js/discord.js'),
    settings: require('./js/settings.js'),
    bitbucket: require('./js/bitbucket.js'),
    bluebird: require("bluebird"),
    client: null,
};

const error = (err) => {
    g.lib.error(g.client, err);
};
const log = (log) => {
    g.lib.log(g.client, log);
};

process.on("unhandledRejection", (reason, promise) => {
    error(`Unhandled Rejection\nReason: ${JSON.stringify(reason)}\nPromise: ${JSON.stringify(promise)}`);
});

const init = () => {
    return g.discord.init().then((client) => {
        g.client = client;
    });
};

const main = () => {
    g.client.on('error', (err) => {
        g.lib.error(g.client, err);
    }).on('disconnect', () => {
        g.lib.log(g.client, "Reconnecting...");
        g.client.login();
    });
    g.bitbucket.run(g.client);
};

exports.run = () => {
    return init().then(main).catch((err) => { console.error(err); });
};
