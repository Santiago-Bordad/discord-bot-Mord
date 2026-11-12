const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('decir')
        .setDescription('el bot manda un mensaje')
        // opcion obligatoria de texto
        .addStringOption((option) =>
            option
                .setName('mensaje')
                .setDescription('lo que va a decir el bot')
                .setRequired(true)
                .setMaxLength(2000),
        )
        // opcion opcional de canal (solo canales de texto)
        .addChannelOption((option) =>
            option
                .setName('canal')
                .setDescription('donde mandarlo (si no se pone, aca)')
                .addChannelTypes(ChannelType.GuildText),
        )
        // solo lo ven quienes pueden gestionar mensajes
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        // leemos las opciones
        const mensaje = interaction.options.getString('mensaje');
        const canal = interaction.options.getChannel('canal') ?? interaction.channel;

        // mandamos el mensaje al canal
        await canal.send(mensaje);

        // confirmamos solo a quien uso el comando
        await interaction.reply({
            content: `✅ mensaje enviado en ${canal}`,
            flags: MessageFlags.Ephemeral,
        });
    },
};