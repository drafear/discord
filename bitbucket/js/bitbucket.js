'use strict';

const g = {
    lib: require('./lib.js'),
    settings: require('./settings.js'),
    bitbucketPayload: require('bitbucket-payload'),
    hapi: require('hapi'),
    port: +(process.env.OPENSHIFT_NODEJS_PORT || '8080'),
    ip: null,
    client: null,
    server: null,
    prefix: "[Bitbucket]",
    targetChannel: null,
    eventEmitter: require('events'),
    emitter: null,
};
g.ip = process.env.OPENSHIFT_NODEJS_IP || g.lib.getLocalAddress(["ローカル エリア接続", "ワイヤレス ネットワーク接続"]).ipv4.address;
g.emitter = new g.eventEmitter();

const log = (msg) => {
    g.lib.log(g.client, g.prefix, msg);
};
const error = (msg) => {
    g.lib.error(g.client, g.prefix, msg);
};
const say = (msg) => {
    g.targetChannel.sendMessage(msg);
};
const init = () => {
    g.targetChannel = g.client.getTextChannel(g.settings.isTest ? "test" : "bitbucket");
    g.server = new g.hapi.Server();
    g.server.connection({
        port: g.port,
        host: g.ip,
    });
    g.server.route({
        method: 'POST',
        path: '/bitbucket',
        handler: (request, reply) => {
            reply().code(204);
            const payload = request.payload;
            if (!payload) return; // webhook以外の場合
            if (!request.headers["x-event-key"]) return;
            g.emitter.emit(request.headers["x-event-key"], payload);
        },
    });
    g.server.start(() => {
        log(`Server is Running at: ${g.server.info.uri}`);
    });
    g.emitter.on('repo:push', (payload) => {
        for (const change of payload.push.changes) {
            for (const commit of change.commits) {
                log(`New Commit ${commit.hash} By ${commit.author.raw}`);
                say(`New Commit ${commit.hash} By ${commit.author.raw}\n\`\`\`${commit.message}\`\`\`\n${commit.links.html.href}`);
            }
        }
    });
};
exports.run = (client) => {
    g.client = client;
    init();
};
