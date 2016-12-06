'use strict';

const global = {
    mongoose: require('mongoose'),
    settings: require('./settings.js'),
};
global.mongoose.Promise = require('bluebird');

exports.init = () => {
    return new Promise((resolve, reject) => {
        const db = global.mongoose.createConnection(global.settings.url.mongodb, (err, res) => {
            if (err) {
                reject(err, res);
            }
            else {
                resolve(res);
            }
        });
        exports.db = {
            patchnotes: db.model('Patchnotes', require('../patchnote-watcher/main.js').createModel(global.mongoose)),
        };
    });
};
