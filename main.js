'use strict';

const global = {
    lib: require('./js/general/lib.js'),
    discord: require('./js/general/discord.js'),
    model: require('./js/general/model.js'),
    settings: require('./js/general/settings.js'),
    client: null,
};

const init = () => {
    return Promise.all([
        global.discord.init().then((client) => {
            global.client = client;
        }),
        global.model.init(),
    ]);
};

const main = () => {
    require('./js/patchnote-watcher/main.js').run(global.client, global.model.db.patchnotes);
    require('./js/terminal/main.js').run(global.client);
};

init().then(main);