'use strict';

const g = {
    lib: require('./js/general/lib.js'),
    discord: require('./js/general/discord.js'),
    model: require('./js/general/model.js'),
    settings: require('./js/general/settings.js'),
    taskManager: require('./js/general/task-manager.js').TaskManager,
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
    const tm = new g.taskManager([
        {
            name: "patchnote-watcher",
            task: require('./js/patchnote-watcher/main.js').run(g.client, g.model.db.patchnotes),
        },
        {
            name: "terminal",
            task: require('./js/terminal/main.js'),
        },
    ]);
    tm.task("terminal").run(g.client, tm);
    g.client.on('error', (err) => {
        error(g.client, err);
    }).on('reconnecting', () => {
        console.log("Reconnecting...");
        // tm.pause().then(() => g.client.login()).then(() => tm.resume()).catch((err) => {
        //     console.log(err);
        // });
    });
};

exports.run = () => {
    return init().then(main).catch((err) => { console.error(err); });
};
