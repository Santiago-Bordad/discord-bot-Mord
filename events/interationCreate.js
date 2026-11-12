const { Events, MessageFlags } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    once: false, // se ejecuta con cada interaccion

    async execute(interaction, client) {
        // por ahora solo slash commands (botones, menus y modals van en las templates)
        if (!interaction.isChatInputCommand()) return;

        // buscamos el comando por su nombre
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        // ejecutamos el comando y si falla avisamos
        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);

            const respuesta = {
                content: '❌ hubo un error ejecutando el comando',
                flags: MessageFlags.Ephemeral, // solo lo ve quien uso el comando
            };

            // si ya se respondio usamos followUp, si no reply
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(respuesta);
            } else {
                await interaction.reply(respuesta);
            }
        }
    },
};