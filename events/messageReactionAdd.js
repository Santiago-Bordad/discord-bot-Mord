const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageReactionAdd,
    once: false, // cada vez que alguien reacciona

    async execute(reaction, user) {
        // ignoramos reacciones de bots
        if (user.bot) return;

        // si la reaccion o el mensaje son viejos, los completamos con fetch
        try {
            if (reaction.partial) await reaction.fetch();
            if (reaction.message.partial) await reaction.message.fetch();
        } catch (error) {
            // si el mensaje se borro mientras tanto, fetch falla
            return console.error('no se pudo completar la reaccion:', error);
        }

        // solo nos interesa la estrella
        if (reaction.emoji.name !== '⭐') return;

        const canal = reaction.message.guild.channels.cache.get(process.env.CANAL_LOGS);
        if (!canal) return;

        await canal.send(`⭐ **${user.tag}** destaco un mensaje de **${reaction.message.author.tag}**: ${reaction.message.url}`);
    },
};