'use strict';

const g = {
    settings: require('../general/settings.js'),
    prefix: "[Patchnote Watcher]",
    jsdom: require('jsdom'),
    lib: require('../general/lib.js'),
    pauser: new (require('../general/pauser.js').Pauser)(),
    client: null,
    db: null,
    interval: 1000 * 60 * 60,
};
const say = (msg) => {
    return g.client.getTextChannel(g.settings.isTest ? "test" : "patchnotes").sendMessage(msg);
};
const log = (msg) => {
    g.lib.log(g.client, g.prefix, msg);
};
const error = (msg) => {
    g.lib.error(g.client, g.prefix, msg);
};
const getPatchnotes = () => {
    return new Promise((resolve, reject) => {
        g.jsdom.env("http://us.battle.net/forums/en/overwatch/21446648/", [], (err, window) => {
            const res = [];
            if (err === null) {
                const topics = window.document.querySelectorAll(".ForumTopic.has-blizzard-post");
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
        g.db.find({ id: url }, (err, data) => {
            if (err) reject(err);
            else {
                if (data.length === 0) {
                    log(`New Patchnote: ${title}`);
                    say(`\`\`\`${title}\`\`\`\n${url}`).then(() => {
                        return g.db({ id: url }).save((err) => {
                            if (err) throw err;
                        });
                    }).then(resolve, reject);
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
        g.client = client;
        g.db = db;
        const loop = () => {
            g.pauser.main()
                .then(g.lib.sleep(g.interval))
                .catch((err) => {
                    error(err);
                })
                .then(loop);
        };
        g.pauser.set_main(update);
        loop();
    }
    catch (err) {
        error(err);
    }
    return exports;
};
exports.createModel = (mongoose) => {
    return new mongoose.Schema({
        id: String,
    });
};
exports.pause = () => g.pauser.pause();
exports.resume = () => g.pauser.resume();
