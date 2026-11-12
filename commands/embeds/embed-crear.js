// template: el usuario arma su propio embed con opciones y lo manda a un canal
const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { embedExito, embedError } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed-crear')
        .setDescription('crea un embed personalizado')
        .addStringOption((option) =>
            option.setName('titulo').setDescription('titulo del embed').setRequired(true).setMaxLength(256),
        )
        .addStringOption((option) =>
            option.setName('descripcion').setDescription('texto principal (usa \\n para salto de linea)').setRequired(true).setMaxLength(4096),
        )
        .addStringOption((option) =>
            option.setName('color').setDescription('color en hex, ej: #ff0000'),
        )
        .addAttachmentOption((option) =>
            option.setName('imagen').setDescription('imagen grande abajo'),
        )
        .addChannelOption((option) =>
            option.setName('canal').setDescription('donde mandarlo (si no se pone, aca)').addChannelTypes(ChannelType.GuildText),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        // leemos las opciones
        const titulo = interaction.options.getString('titulo');
        // discord no deja escribir enters en una opcion, asi que reemplazamos \n por saltos reales
        const descripcion = interaction.options.getString('descripcion').replaceAll('\\n', '\n');
        const color = interaction.options.getString('color') ?? '#5865f2';
        const imagen = interaction.options.getAttachment('imagen');
        const canal = interaction.options.getChannel('canal') ?? interaction.channel;

        // validamos que el color sea un hex valido (#ff0000)
        if (!/^#[0-9a-f]{6}$/i.test(color)) {
            return interaction.reply({
                embeds: [embedError('color invalido, usa el formato `#ff0000`')],
                flags: MessageFlags.Ephemeral,
            });
        }

        // armamos el embed
        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setDescription(descripcion)
            .setColor(color)
            .setTimestamp();

        // la imagen solo si mandaron una y es imagen de verdad
        if (imagen?.contentType?.startsWith('image/')) {
            embed.setImage(imagen.url);
        }

        // mandamos el embed y confirmamos solo a quien lo uso
        await canal.send({ embeds: [embed] });
        await interaction.reply({
            embeds: [embedExito(`embed enviado en ${canal}`)],
            flags: MessageFlags.Ephemeral,
        });
    },
};