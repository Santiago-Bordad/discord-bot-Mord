const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    once: false, // cada vez que alguien se va (o lo echan)

    async execute(member) {
        // buscamos el canal de logs
        const canal = member.guild.channels.cache.get(process.env.CANAL_LOGS);
        if (!canal) return console.warn('⚠️ no encontre el canal de logs');

        // usamos el tag porque el miembro ya no esta en el servidor (la mencion no se veria bien)
        await canal.send(`📤 **${member.user.tag}** salio del servidor. quedan ${member.guild.memberCount} miembros`);
    },
};