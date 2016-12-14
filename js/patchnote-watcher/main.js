'use strict';

const global = {
    settings: require('../general/settings.js'),
    prefix: "[Patchnote Watcher]",
    jsdom: require('jsdom'),
    lib: require('../general/lib.js'),
    client: null,
    db: null,
};

const say = (msg) => {
    global.client.getTextChannel(global.settings.isTest ? "test" : "patchnotes").sendMessage(msg);
};
const log = (msg) => {
    global.lib.log(global.client, global.prefix, msg);
};
const error = (msg) => {
    global.lib.error(global.client, global.prefix, msg);
};
const getPatchnotes = () => {
    return new Promise((resolve, reject) => {
        global.jsdom.env("http://us.battle.net/forums/en/overwatch/21446648/", [], (err, window) => {
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
const check = ({url, title}) => {
    return new Promise((resolve, reject) => {
        global.db.find({ id: url }, (err, data) => {
            if (err) reject(err);
            else {
                if (data.length === 0) {
                    log(`New Patchnote: ${title}`);
                    new global.db({ id: url }).save((err) => {
                        if (err) reject(err);
                        else {
                            say(`\`\`\`${title}\`\`\`\n${url}`);
                            resolve();
                        }
                    });
                }
                else {
                    resolve();
                }
            }
        });
    });
};
const update = () => {
    log("Update");
    return getPatchnotes().then((pns) => {
        return Promise.all(pns.reverse().map((pn) => {
            return check(pn);
        }));
    });
};
exports.run = (client, db) => {
    try {
        global.client = client;
        global.db = db;
        const loop = () => {
            update()
                .then(global.lib.sleep(1000*60*60))
                .then(loop)
                .catch((err) => {
                    error(err)
                });
            log(`Memory Usage: ${global.lib.gc()}`);
        };
        loop();
    }
    catch (err) {
        error(err);
    }
};
exports.createModel = (mongoose) => {
    return new mongoose.Schema({
        id: String,
    });
};
