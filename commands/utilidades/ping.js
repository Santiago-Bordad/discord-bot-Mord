const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('responde con la latencia del bot'),

    async execute(interaction, client) {
        // tiempo entre que se uso el comando y que llego al bot
        const latencia = Date.now() - interaction.createdTimestamp;

        await interaction.reply(`🏓 pong! (${latencia} ms) | api: ${client.ws.ping} ms`);
    },
};