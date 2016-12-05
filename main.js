'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const jsdom = require("jsdom");
const fetch = require('node-fetch');
const storage = require('node-persist');
const co = require('co');

const sleep = (ms) => {
    return (cb) => {
        setTimeout(cb, ms);
    };
}

const global = {
    patchnotes: null,
};
const settings = {
    token: "MjU0OTczNDkwNjg2NDU5OTA0.CyYCmQ.1iDutCmxi5gwSey542N37-mxkDs",
    url: {
        list: "http://us.battle.net/forums/en/overwatch/21446648/",
    },
};

const getChannel = (cond) => {
    if (typeof cond === "string") {
        cond = { name: cond, type: "text" };
    }
    for (const [id, channel] of client.channels) {
        let flag = true;
        for (const key in cond) {
            if (channel[key] !== cond[key]) {
                flag = false;
                break;
            }
        }
        if (flag) return channel;
    }
    return null;
};

const init = () => {
    return Promise.all([
        new Promise((resolve, reject) => {
            client.on('ready', () => {
                console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
                resolve();
            });
        }),
        storage.init().then(() => {
            return storage.get("patchnotes").then((value) => {
                if (value !== undefined) {
                    global.patchnotes = value;
                }
                else {
                    global.patchnotes = {};
                }
            });
        }),
    ]);
};

client.on('message', msg => {
    if (msg.content === 'ping') msg.reply('Pong!');
});

const getPatchnotes = () => {
    return new Promise((resolve, reject) => {
        jsdom.env("http://us.battle.net/forums/en/overwatch/21446648/", [], (err, window) => {
            const res = [];
            if (err === null) {
                const topics = window.document.querySelectorAll(".ForumTopic.has-blizzard-post.is-inactive");
                for (const topic of topics) {
                    const title = topic.querySelector(".ForumTopic-title").textContent.replace(/[\n\r\t]/g, "");
                    if (title.search(/^\[(PC|ALL)\] Overwatch Patch Notes/) >= 0) {
                        res.push({ url: topic.href, title: title });
                    }
                }
                resolve(res);
            }
            else {
                reject(err);
            }
        });
    });
};
const say = (msg) => {
    getChannel("patchnotes").sendMessage(msg);
};
const check = ({url, title}) => {
    if ( url in global.patchnotes ) return;
    global.patchnotes[url] = true;
    storage.set("patchnotes", global.patchnotes);
    say(`\`\`\`${title}\`\`\`\n${url}`);
};
const update = () => {
    console.log("update");
    getPatchnotes().then((pns) => {
        pns = pns.reverse();
        for (const pn of pns) {
            check(pn);
        }
    });
};
const main = () => {
    co(function *() {
        while (true) {
            update();
            yield sleep(1000*60*60);
        }
    });
};


client.login(settings.token);
init().then(main);