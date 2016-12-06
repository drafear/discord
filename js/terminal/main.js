'use strict';

const global = {
    prefix: "[Terminal]",
    settings: require('../general/settings.js'),
    lib: require('../general/lib.js'),
    program: {},
    programSrc: {
        "rc": require('./commands/random-character.js'),
    },
    client: null,
};

const error = (err) => {
    global.lib.error(global.client, global.prefix, err);
};
const log = (msg) => {
    global.lib.log(global.client, global.prefix, msg);
};

const init = (client) => {
    global.client = client;
    for (const key in global.programSrc) {
        global.program[key] = global.programSrc[key].init();
    }
};

const exec = (fullcmdstr, msg) => {
    const argv = fullcmdstr.replace(/[\s　]+/g, " ").split(" ").filter(elem => elem !== "");
    if (argv.length === 0) return;
    const cmdstr = argv[0];
    argv[0] = `\$${argv[0]}`;
    argv.unshift(argv[0]);
    if (cmdstr === "help") {
        const commandHelps = Object.keys(global.programSrc).map(cmd => `\$${cmd} : ${global.programSrc[cmd].explanation}`)
        msg.reply(`These shell commands are available.\n${commandHelps.join("\n")}`);
    }
    else if (cmdstr in global.programSrc) {
        try {
            const newArgv = argv.filter(arg => arg !== "--help" && arg !== "-h");
            const param = global.program[cmdstr].parse(newArgv);
            if (argv.length !== newArgv.length) { // help
                try {
                    global.program[cmdstr].outputHelp((help) => {
                        msg.reply(help);
                    });
                }
                catch (err) { // ライブラリのバグで常に例外を吐く
                }
            }
            else {
                global.programSrc[cmdstr].run(global.client, param, msg);
            }
        }
        catch (err) {
            msg.reply(err);
        }
    }
    else {
        msg.reply(`Unknown Command: ${cmdstr}\nType "$help" to see all available commands.`);
    }
};

exports.run = (client) => {
    try {
        init(client);
        const id = client.getTextChannel(global.settings.isTest ? "test" : "terminal").id;
        client.on('message', (msg) => {
            if (msg.author.bot) return;
            if (msg.channel.id === id) {
                if (msg.content.match(/^\$/)) {
                    exec(msg.content.replace(/^\$/, ""), msg);
                }
            }
        });
        log("Started");
    }
    catch (err) {
        error(err);
    }
};