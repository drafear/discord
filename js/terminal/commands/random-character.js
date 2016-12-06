'use strict';

const global = {
    fs: require('fs'),
    classes: ["offense", "defense", "tank", "support"],
    path: {
        imgroot: "image/hero",
    },
    client: null,
};

exports.explanation = "Choose a random character.";

exports.init = (base) => {
    return require('commander')
        .option("-o, --offense", "Include Offense Characters")
        .option("-d, --defense", "Include Defense Characters")
        .option("-t, --tank", "Include Tank Character")
        .option("-s, --support", "Include Support Character")
};

exports.run = (client, param, msg) => {
    global.client = client;
    let useClasses = global.classes.filter(cls => param[cls]);
    if (useClasses.length === 0) {
        useClasses = global.classes;
    }
    let targets = [];
    Promise.all(
        global.classes.map((cls) => {
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
        msg.reply(`${heroName}`);
        msg.channel.sendFile(heroImgFile, `${heroName}.png`);
    });
};
