'use strict';

const global = {
    lineparser: require('../../general/lineparser.js'),
    fs: require('fs'),
    classes: ["offense", "defense", "tank", "support"],
    path: {
        imgroot: "image/hero",
    },
    client: null,
    message: null,
};

exports.explanation = "Choose a random character";

exports.init = (client, msg) => {
    global.client = client;
    global.message = msg;
    global.parser = global.lineparser.init({
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
    return global.parser;
};

const help = (r, token) => {
    global.message.reply( `\`\`\`${r.help()}\`\`\`` );
};

const run = ({parameters: params, flags: flags}, token) => {
    let useClasses = global.classes.filter(cls => flags[cls]);
    if (useClasses.length === 0) {
        useClasses = global.classes;
    }
    let targets = [];
    Promise.all(
        useClasses.map((cls) => {
            return new Promise((resolve, reject) => {
                global.fs.readdir(`${global.path.imgroot}/${cls}`, (err, files) => {
                    if (err) throw err;
                    targets = targets.concat(files.map(file => `${global.path.imgroot}/${cls}/${file}`));
                    resolve();
                });
            });
        })
    ).then(() => {
        const heroImgFile = targets[Math.floor(Math.random()*targets.length)];
        const heroNameSmall = heroImgFile.replace(/^.*\/([^\/]*)\.[^\.]*$/, "$1");
        const heroName = heroNameSmall.charAt(0).toUpperCase() + heroNameSmall.substr(1);
        global.message.reply(`${heroName}`);
        global.message.channel.sendFile(heroImgFile, `${heroName}.png`);
    });
};

