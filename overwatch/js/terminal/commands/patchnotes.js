'use strict';

const g = {
    lineparser: require('../../general/lineparser.js'),
    client: null,
    message: null,
    task: null,
};

exports.explanation = "Choose a random character";

exports.init = (client, msg, taskManager) => {
    g.client = client;
    g.message = msg;
    g.task = taskManager.task("patchnote-watcher");
    g.parser = g.lineparser.init({
        program: "$patchnotes",
        name: "Patchnote Manager",
        version: "1.0.0",
        subcommands: ["ls", "rm", "update"],
        options: {
            flags: [
                ["h", "help", "Show this text"],
            ],
        },
        usages: [
            ["ls", null, null, "Show Patchnote List", Commands.ls],
            ["rm", null, ["target"], "Remove Patchnotes", Commands.rm],
            ["update", null, null, "Update Patchnotes", Commands.update],
            [null, ["h"], null, "help", help],
            [null, null, null, "help", help],
        ],
    });
    return g.parser;
};

const help = (r, token) => {
    g.message.reply( `\`\`\`${r.help()}\`\`\`` );
};

const Commands = {
    ls: (r, token) => {
        g.task.getList().then((patchnotes) => {
            g.message.reply(`\`\`\`${patchnotes.join("\n")}\`\`\``);
        }).catch((err) => {
            g.message.reply(`Fail to get the patchnote list\nReason: ${JSON.stringfy(err)}`);
        });
    },
    rm: (r, token) => {
        const target = r.args[0];
        g.task.getList().then((list) => {
            const removeList = list.filter(item => item === target);
            if (removeList.length == 0) {
                g.message.reply(`Can't find the item: ${target}\nCall \`$patchnotes ls\` to show the patchnote list.`);
            }
            else {
                return Promise.all(removeList.map(item => g.task.remove(item))).then(() => {
                    g.message.reply(`Remove the Patchnote \`${target}\` Successfully!!`);
                })
            }
        }).catch((err) => {
            g.message.reply(`Can't remove the item: ${target}\nReason: ${JSON.stringfy(err)}`);
        });
    },
    update: (r, token) => {
        g.task.update().then(() => {
            g.message.reply("Update Patchnotes Successfully!!");
        }).catch((err) => {
            g.message.reply(`Fail to update patchnotes\nReason: ${JSON.stringfy(err)}`);
        });
    },
};
