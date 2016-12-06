'use strict';

const global = {
    lib: require('./lib.js'),
    discord: require('./discord.js'),
    model: require('./model.js'),
    settings: require('./settings.js'),
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

// client.on('message', msg => {
//     if (msg.content === 'ping') msg.reply('Pong!');
// });

const main = () => {
    require('./patchnote-watcher.js').run(global.client, global.model.db.patchnotes);
};

init().then(main);