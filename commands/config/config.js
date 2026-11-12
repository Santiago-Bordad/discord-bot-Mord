// /config: guardar y ver la configuracion del servidor (ejemplo de subcomandos + base de datos)
const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, MessageFlags } = require('discord.js');
const { guardarConfig, borrarConfig, todaLaConfig } = require('../../database/config');
const { embedExito, embedInfo } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('configuracion del bot en este servidor')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        // subcomando: /config canal
        .addSubcommand((sub) =>
            sub
                .setName('canal')
                .setDescription('elegir un canal para una funcion')
                .addStringOption((option) =>
                    option
                        .setName('funcion')
                        .setDescription('para que es el canal')
                        .setRequired(true)
                        // choices: el usuario solo puede elegir de esta lista
                        .addChoices(
                            { name: 'logs', value: 'canal_logs' },
                            { name: 'bienvenidas', value: 'canal_bienvenida' },
                            { name: 'sugerencias', value: 'canal_sugerencias' },
                        ),
                )
                .addChannelOption((option) =>
                    option.setName('canal').setDescription('el canal').setRequired(true).addChannelTypes(ChannelType.GuildText),
                ),
        )

        // subcomando: /config ver
        .addSubcommand((sub) => sub.setName('ver').setDescription('ver la configuracion actual'))

        // subcomando: /config borrar
        .addSubcommand((sub) =>
            sub
                .setName('borrar')
                .setDescription('borrar un valor de la configuracion')
                .addStringOption((option) =>
                    option
                        .setName('funcion')
                        .setDescription('que borrar')
                        .setRequired(true)
                        .addChoices(
                            { name: 'logs', value: 'canal_logs' },
                            { name: 'bienvenidas', value: 'canal_bienvenida' },
                            { name: 'sugerencias', value: 'canal_sugerencias' },
                        ),
                ),
        ),

    async execute(interaction) {
        // que subcomando se uso
        const sub = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        if (sub === 'canal') {
            const funcion = interaction.options.getString('funcion');
            const canal = interaction.options.getChannel('canal');

            // guardamos el id del canal en la base de datos
            guardarConfig(guildId, funcion, canal.id);

            return interaction.reply({
                embeds: [embedExito(`\`${funcion}\` ahora es ${canal}`)],
                flags: MessageFlags.Ephemeral,
            });
        }

        if (sub === 'ver') {
            const config = todaLaConfig(guildId);

            // los ids de canal los mostramos como mencion (<#id>)
            const texto = config.length
                ? config.map(({ clave, valor }) => `**${clave}**: <#${valor}>`).join('\n')
                : 'no hay nada configurado todavia';

            return interaction.reply({ embeds: [embedInfo(texto)], flags: MessageFlags.Ephemeral });
        }

        if (sub === 'borrar') {
            const funcion = interaction.options.getString('funcion');
            borrarConfig(guildId, funcion);

            return interaction.reply({ embeds: [embedExito(`\`${funcion}\` borrado`)], flags: MessageFlags.Ephemeral });
        }
    },
};