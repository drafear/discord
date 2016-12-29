'use strict';

const g = {
    prefix: "[Terminal]",
    settings: require('../general/settings.js'),
    lib: require('../general/lib.js'),
    commands: [
        {
            channel: "terminal",
            testChannel: "test",
            program: {
                "rc": require('./commands/random-character.js'),
            },
        },
        {
            channel: "dev-terminal",
            testChannel: "dev-terminal-test",
            program: {
                "info": require('./commands/info.js'),
                "patchnotes": require('./commands/patchnotes.js'),
            },
        },
    ],
    client: null,
};

const error = (err) => {
    g.lib.error(g.client, g.prefix, err);
};
const log = (msg) => {
    g.lib.log(g.client, g.prefix, msg);
};

const init = (client) => {
    g.client = client;
    g.commands.forEach((cmd) => {
        cmd.testChannel = g.client.getTextChannel(cmd.testChannel).id;
        cmd.channel = g.client.getTextChannel(cmd.channel).id;
    });
};

const exec = (fullcmdstr, msg, command) => {
    const argv = fullcmdstr.replace(/[\s　]+/g, " ").split(" ").filter(elem => elem !== "");
    if (argv.length === 0) return;
    const cmdstr = argv[0];
    if (cmdstr === "help") {
        const commandHelps = Object.keys(command.program).map(cmd => [`\$${cmd}`, command.program[cmd].explanation]);
        commandHelps.push(["$help", "Show this help"])
        const maxCommandLength = commandHelps.map(cmd => cmd[0].length).reduce((a, b) => Math.max(a, b), 0);
        const spaces = [""];
        for (let i = 1; i <= maxCommandLength; ++i) spaces[i] = spaces[i-1]+" ";
        const commandHelpStr = commandHelps.map(cmd => cmd[0]+spaces[maxCommandLength-cmd[0].length]+"  "+cmd[1]).join("\n");
        msg.reply(`These shell commands are available.\n\`\`\`${commandHelpStr}\`\`\``);
    }
    else if (cmdstr in command.program) {
        try {
            command.program[cmdstr].init(g.client, msg, g.taskManager).parse(argv.slice(1));
        }
        catch (err) {
            msg.reply(err);
        }
    }
    else {
        msg.reply(`Unknown Command: ${cmdstr}\nType "$help" to see all available commands.`);
    }
};

exports.run = (client, taskManager) => {
    try {
        g.taskManager = taskManager;
        init(client);
        client.on('message', (msg) => {
            try {
                if (msg.author.bot) return;
                if (msg.content.search(/^\$/) < 0) return;
                const cmdstr = msg.content.replace(/^\$/, "");
                g.commands.forEach((cmd) => {
                    const channelId = g.settings.isTest ? cmd.testChannel : cmd.channel;
                    if (msg.channel.id == channelId) {
                        exec(cmdstr, msg, cmd);
                    }
                });
            }
            catch (err) {
                error(err);
            }
        });
        log("Started");
    }
    catch (err) {
        error(err);
    }
    return exports;
};
exports.pause = () => {};
exports.resume = () => {};
