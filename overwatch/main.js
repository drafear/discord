'use strict';

const g = {
    lib: require('./js/general/lib.js'),
    discord: require('./js/general/discord.js'),
    model: require('./js/general/model.js'),
    settings: require('./js/general/settings.js'),
    taskManager: require('./js/general/task-manager.js'),
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
    return Promise.all([
        g.discord.init().then((client) => {
            g.client = client;
        }),
        g.model.init(),
    ]);
};

const main = () => {
    const tm = new g.taskManager.TaskManager([
        require('./js/patchnote-watcher/main.js').run(g.client, g.model.db.patchnotes),
        require('./js/terminal/main.js').run(g.client),
    ]);
    g.client.on('error', (err) => {
        g.lib.error(g.client, err);
    }).on('reconnecting', () => {
        g.lib.log(g.client, "Reconnecting...");
        // tm.pause().then(() => g.client.login()).then(() => tm.resume()).catch((err) => {
        //     console.log(err);
        // });
    });
};

exports.run = () => {
    return init().then(main).catch((err) => { console.error(err); });
};
