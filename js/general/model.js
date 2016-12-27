'use strict';

const g = {
    mongoose: require('mongoose'),
    settings: require('./settings.js'),
};
g.mongoose.Promise = require('bluebird');

exports.init = () => {
    return new Promise((resolve, reject) => {
        const db = g.mongoose.createConnection(g.settings.url.mongodb, (err, res) => {
            if (err) {
                reject(err, res);
            }
            else {
                resolve(res);
            }
        });
        exports.db = {
            patchnotes: db.model('Patchnotes', require('../patchnote-watcher/main.js').createModel(g.mongoose)),
        };
    });
};
