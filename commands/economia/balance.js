// /balance: ver las monedas de alguien y el top del servidor
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { obtenerUsuario, topMonedas } = require('../../database/usuarios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('ver tus monedas y el top del servidor')
        .addUserOption((option) => option.setName('usuario').setDescription('ver las de otro usuario')),

    async execute(interaction) {
        const objetivo = interaction.options.getUser('usuario') ?? interaction.user;
        const { monedas } = obtenerUsuario(interaction.guild.id, objetivo.id);

        // top 5 del servidor
        const top = topMonedas(interaction.guild.id, 5);
        const medallas = ['🥇', '🥈', '🥉', '4.', '5.'];
        const textoTop = top.length
            ? top.map((u, i) => `${medallas[i]} <@${u.user_id}> - ${u.monedas} 🪙`).join('\n')
            : 'nadie tiene monedas todavia';

        const embed = new EmbedBuilder()
            .setColor(0xfee75c)
            .setAuthor({ name: objetivo.username, iconURL: objetivo.displayAvatarURL() })
            .setDescription(`tiene **${monedas}** monedas 🪙`)
            .addFields({ name: 'top del servidor', value: textoTop });

        await interaction.reply({ embeds: [embed] });
    },
};