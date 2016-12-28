'use strict';

const g = {
    lineparser: require('../../general/lineparser.js'),
    fs: require('fs'),
    lib: require('../../general/lib.js'),
    client: null,
    message: null,
};

exports.explanation = "Choose a random character";

exports.init = (client, msg) => {
    g.client = client;
    g.message = msg;
    g.parser = g.lineparser.init({
        program: "$info",
        name: "Show Information",
        version: "1.0.0",
        options: {
            flags: [
                ["h", "help", "Show this text"],
            ],
        },
        usages: [
            [null, ["h"], null, "Help", help],
            [null, null, null, "Show Info", run],
        ],
    });
    return g.parser;
};

const help = (r, token) => {
    g.message.reply( `\`\`\`${r.help()}\`\`\`` );
};

const run = ({parameters: params, flags: flags}, token) => {
    g.message.reply(`Memory Usage: ${Math.round(g.lib.gc()/1024)} KB`);
};

