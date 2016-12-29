'use strict';

const g = {
    lineparser: require('../../general/lineparser.js'),
    fs: require('fs'),
    classes: ["offense", "defense", "tank", "support"],
    path: {
        imgroot: "image/hero",
    },
    client: null,
    message: null,
    taskManager: null,
};

exports.explanation = "Choose a random character";

exports.init = (client, msg, taskManager) => {
    g.client = client;
    g.message = msg;
    g.taskManager = taskManager;
    g.parser = g.lineparser.init({
        program: "$rc",
        name: "Random Character Chooser",
        version: "1.0.0",
        options: {
            flags: [
                ["h", "help", "Show this text"],
                ["o", "offense", "Include Offense Characters"],
                ["d", "defense", "Include Defense Characters"],
                ["t", "tank", "Include Tank Characters"],
                ["s", "support", "Include Support Characters"],
            ],
        },
        usages: [
            [null, ["h"], null, "help", help],
            [null, ["[o]", "[d]", "[t]", "[s]"], null, "choose", run],
        ],
    });
    return g.parser;
};

const help = (r, token) => {
    g.message.reply( `\`\`\`${r.help()}\`\`\`` );
};

const run = ({parameters: params, flags: flags}, token) => {
    let useClasses = g.classes.filter(cls => flags[cls]);
    if (useClasses.length === 0) {
        useClasses = g.classes;
    }
    let targets = [];
    Promise.all(
        useClasses.map((cls) => {
            return new Promise((resolve, reject) => {
                g.fs.readdir(`${g.path.imgroot}/${cls}`, (err, files) => {
                    if (err) throw err;
                    targets = targets.concat(files.map(file => `${g.path.imgroot}/${cls}/${file}`));
                    resolve();
                });
            });
        })
    ).then(() => {
        const heroImgFile = targets[Math.floor(Math.random()*targets.length)];
        const heroNameSmall = heroImgFile.replace(/^.*\/([^\/]*)\.[^\.]*$/, "$1");
        const heroName = heroNameSmall.charAt(0).toUpperCase() + heroNameSmall.substr(1);
        g.message.reply(`${heroName}`);
        g.message.channel.sendFile(heroImgFile, `${heroName}.png`);
    });
};

