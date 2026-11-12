const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageDelete,
    once: false, // cada vez que se borra un mensaje

    async execute(message) {
        // ignoramos mds
        if (!message.guild) return;

        // si el mensaje era viejo (partial) no tenemos autor ni contenido
        if (message.partial) {
            const canal = message.guild.channels.cache.get(process.env.CANAL_LOGS);
            if (canal) await canal.send(`🗑️ se borro un mensaje viejo en ${message.channel} (no estaba en cache)`);
            return;
        }

        // ignoramos mensajes de bots
        if (message.author.bot) return;

        const canal = message.guild.channels.cache.get(process.env.CANAL_LOGS);
        if (!canal) return console.warn('⚠️ no encontre el canal de logs');

        // si no tenia texto (solo imagen, por ej) lo aclaramos
        const contenido = message.content || '*sin texto*';

        await canal.send(`🗑️ mensaje de **${message.author.tag}** borrado en ${message.channel}:\n> ${contenido}`);
    },
};