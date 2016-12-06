'use strict';

const global = {
    prefix: "[Terminal]",
    settings: require('../general/settings.js'),
    lib: require('../general/lib.js'),
    program: {
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
};

const exec = (fullcmdstr, msg) => {
    const argv = fullcmdstr.replace(/[\s　]+/g, " ").split(" ").filter(elem => elem !== "");
    if (argv.length === 0) return;
    const cmdstr = argv[0];
    if (cmdstr === "help") {
        const commandHelps = Object.keys(global.program).map(cmd => [`\$${cmd}`, global.program[cmd].explanation]);
        commandHelps.push(["$help", "Show this help"])
        const maxCommandLength = commandHelps.map(cmd => cmd[0].length).reduce((a, b) => Math.max(a, b), 0);
        const spaces = [""];
        for (let i = 1; i <= maxCommandLength; ++i) spaces[i] = spaces[i-1]+" ";
        const commandHelpStr = commandHelps.map(cmd => cmd[0]+spaces[maxCommandLength-cmd[0].length]+"  "+cmd[1]).join("\n");
        msg.reply(`These shell commands are available.\n\`\`\`${commandHelpStr}\`\`\``);
    }
    else if (cmdstr in global.program) {
        try {
            global.program[cmdstr].init(global.client, msg).parse(argv.slice(1));
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