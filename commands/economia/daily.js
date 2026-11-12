// /daily: reclamar monedas una vez cada 24 horas (cooldown guardado en la base de datos)
const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { obtenerUsuario, sumarMonedas, guardarDaily } = require('../../database/usuarios');
const { embedExito, embedAviso } = require('../../utils/embeds');

const ESPERA = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
const PREMIO = 100;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription(`reclama ${PREMIO} monedas cada 24 horas`),

    async execute(interaction) {
        const { guild, user } = interaction;
        const usuario = obtenerUsuario(guild.id, user.id);
        const ahora = Date.now();

        // si no pasaron 24 horas desde el ultimo, le decimos cuando puede
        const proximo = usuario.ultimo_daily + ESPERA;
        if (ahora < proximo) {
            return interaction.reply({
                embeds: [embedAviso(`ya reclamaste hoy, volve <t:${Math.round(proximo / 1000)}:R>`)],
                flags: MessageFlags.Ephemeral,
            });
        }

        sumarMonedas(guild.id, user.id, PREMIO);
        guardarDaily(guild.id, user.id, ahora);

        await interaction.reply({
            embeds: [embedExito(`ganaste **${PREMIO}** monedas 🪙 ahora tenes **${usuario.monedas + PREMIO}**`)],
        });
    },
};