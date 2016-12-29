'use strict';

const g = {
    discord: require('discord.js'),
    settings: require('./settings.js'),
    lib: require('./lib.js'),
};

exports.init = () => {
    const client = new g.discord.Client();
    const init = () => {
        const channels = {
            text: {},
            voice: {},
            dm: {},
        };
        for (const [id, channel] of client.channels) {
            if (channel.name in channels[channel.type]) {
                throw `ambiguous ${channel.type} channel: ${channel.name}`;
            }
            channels[channel.type][channel.name] = channel;
        }
        client.getTextChannel = (name) => {
            return channels.text[name];
        };
        client.getVoiceChannel = (name) => {
            return channels.voice[name];
        };
        client.getChannel = (cond) => {
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
        g.lib.log(client, `Logged in as ${client.user.username}#${client.user.discriminator}`);
    };
    client.on('disconnect', () => {
        client.isLogin = false;
    });
    client.on('ready', () => {
        client.isLogin = true;
        init();
    });
    client._login = client.login;
    client.login = () => {
        if (client.isLogin) return;
        return client._login(g.settings.token);
    };
    return client.login().then(() => client);
};
