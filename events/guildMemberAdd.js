const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false, // cada vez que alguien entra

    async execute(member) {
        // buscamos el canal de bienvenidas por su id
        const canal = member.guild.channels.cache.get(process.env.CANAL_BIENVENIDA);
        if (!canal) return console.warn('⚠️ no encontre el canal de bienvenida');

        // contamos cuantos miembros hay ahora
        const cantidad = member.guild.memberCount;

        await canal.send(`👋 bienvenido ${member} a **${member.guild.name}**! sos el miembro #${cantidad}`);
    },
};