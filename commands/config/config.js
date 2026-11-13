// /config: guardar y ver la configuracion del servidor (ejemplo de subcomandos + base de datos)
const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, MessageFlags, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require('discord.js');
const { guardarConfig, borrarConfig, todaLaConfig } = require('../../database/config');
const { embedExito, embedInfo } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configura el bot en tu servidor')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            // color de la barra de la izquierda (hex, nombre, rgb o 'Random')
            .setColor(0xff3021)
            // autor: va arriba de todo, chiquito (name obligatorio, iconURL y url opcionales)

            // titulo (max 256) y link al hacer click en el titulo
            .setTitle('Configuracion del bot')
            // texto principal (max 4096), acepta markdown
            .setDescription('Selecciona una opcion del menu para ver o cambiar la configuracion del bot en tu servidor')

            const menu = new StringSelectMenuBuilder()
            .setCustomId('config')                 // con esto lo reconoce menus/config.js
            .setPlaceholder('elegi una opcion')     // texto gris cuando no hay nada elegido
            .addOptions(
                { label: 'Bienvenida', value: 'Configura el canal donde se envian las mensajes de bienvenida', emoji: '1️⃣' },
                { label: 'Logs', value: 'Configura el canal donde se envian los logs', emoji: '2️⃣' },
                { label: 'Tickets', value: 'Configura el canal donde se gestionan los tickets', emoji: '3️⃣' },
            );

        // embeds siempre va como array (se pueden mandar hasta 10 juntos)
        await interaction.reply({ embeds: [embed], components: [menu] });
    },
};