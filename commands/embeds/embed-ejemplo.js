// template de referencia: un embed con TODAS las propiedades que se pueden modificar
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed-ejemplo')
        .setDescription('muestra un embed con todas sus propiedades'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            // color de la barra de la izquierda (hex, nombre, rgb o 'Random')
            .setColor(0x5865f2)

            // autor: va arriba de todo, chiquito (name obligatorio, iconURL y url opcionales)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
                url: 'https://discord.js.org',
            })

            // titulo (max 256) y link al hacer click en el titulo
            .setTitle('titulo del embed')
            .setURL('https://discord.js.org')

            // texto principal (max 4096), acepta markdown
            .setDescription('esta es la **descripcion**. acepta *markdown*, `codigo`, [links](https://discord.js.org) y menciones como ' + `${interaction.user}`)

            // imagen chica arriba a la derecha
            .setThumbnail(interaction.guild.iconURL())

            // campos: max 25, name max 256, value max 1024
            // inline: true = se ponen uno al lado del otro (hasta 3 por fila)
            .addFields(
                { name: 'campo normal', value: 'ocupa todo el ancho' },
                { name: 'inline 1', value: 'al lado', inline: true },
                { name: 'inline 2', value: 'al lado', inline: true },
                { name: 'inline 3', value: 'al lado', inline: true },
                // campo vacio para separar ('\u200B' es un caracter invisible)
                { name: '\u200B', value: '\u200B' },
                { name: 'otro campo', value: 'despues del espacio' },
            )

            // imagen grande abajo
            .setImage('https://cdn.discordapp.com/embed/avatars/0.png')

            // pie: texto (max 2048) e icono chiquito
            .setFooter({
                text: `pedido por ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
            })

            // fecha y hora al lado del footer (sin parametro = ahora)
            .setTimestamp();

        // embeds siempre va como array (se pueden mandar hasta 10 juntos)
        await interaction.reply({ embeds: [embed] });
    },
};