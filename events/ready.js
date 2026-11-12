const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true, // solo se ejecuta cuando el bot se conecta

    execute(client) {
        console.log(`conectado como ${client.user.tag}`);
    },
};