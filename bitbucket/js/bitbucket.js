'use strict';

const g = {
    lib: require('./lib.js'),
    bitbucketPayload: require('bitbucket-payload'),
    hapi: require('hapi'),
    port: +(process.env.OPENSHIFT_NODEJS_PORT || '8080'),
    ip: process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
    client: null,
    server: null,
    prefix: "[Bitbucket]",
};
const log = (msg) => {
    g.lib.log(g.client, g.prefix, msg);
};
const error = (msg) => {
    g.lib.error(g.client, g.prefix, msg);
};
const init = () => {
    g.server = new g.hapi.Server();
    g.server.connection({port: g.port});
    g.server.route({
        method: 'POST',
        path: '/bitbucket',
        handler: (request, reply) => {
            reply().code(204);
            log(request.payload);
        },
    });
    g.server.start(() => {
        log(`Server is Running at: ${g.server.info.uri}`);
    });
};
exports.run = (client) => {
    g.client = client;
    init();
};
