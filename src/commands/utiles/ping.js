const { SlashCommandBuilder } = require('discord.js'); // trae la herramienta para crear comandos

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde pong, es como el Hello World de bots de Discord'),
        //pura descripción del comando nomás

    execute: async (interaction) => { // al recibir una interacción con este comando, ejecuta en forma paralela sin romper el hilo principal del bot, la función que se le pasa como parámetro  
        const latencia = interaction.client.ws.ping; // se guarda la latencia en una variable para poder usarla en el mensaje que se le va a enviar al usuario

        const texto = latencia >= 0 // define el texto que se va a enviar al usuario según la latencia medida
            ? `Pong! Latencia con Discord: ${latencia} ms` 
            : 'Pong! Recien prendida, vuelve a intentar en unos segundos'; // si la latencia es mayor o igual a 0, se envía el mensaje con la latencia medida, si no, se envía un mensaje diciendo que no se puede medir la latencia

        await interaction.reply(texto); // el parametro se pasa a la función reply, que es la que responde al usuario con el mensaje que se le pasa como parámetro 
    },
};