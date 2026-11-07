const { SlashCommandBuilder, EmbedBuilder} = require('discord.js'); // trae la herramienta para crear comandos

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Muestra información sobre el bot'),
        //pura descripción del comando nomás

    execute: async (interaction) => { // al recibir una interacción con este comando, ejecuta en forma paralela sin romper el hilo principal del bot, la función que se le pasa como parámetro
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Información sobre Mord')
            .setDescription('Mord es un bot de Discord creado por Santiago para ayudar a los usuarios a interactuar con el servidor de manera más eficiente.')
            .addFields(
                { name: 'Creador', value: 'Santiago' },
                { name: 'Lenguaje de programación', value: 'JavaScript' },
                { name: 'Librería', value: 'discord.js' },
                { name: 'Versión', value: '1.0.0' },
            )
            .setTimestamp()
            .setFooter({ text: 'Mord Bot', iconURL: 'https://cdn.discordapp.com/attachments/1345924975198208040/1568395778945450004/MORD.png?ex=6aefa9e5&is=6aee5865&hm=57f0594c1c11c9c931474914d3fba5cf68630de2ad830df773ba74302fc50aee' });
        await interaction.reply({ embeds: [embed] });
    },
};