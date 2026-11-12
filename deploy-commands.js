// registra los slash commands en discord
// correrlo cada vez que agregues, cambies o borres un comando: node deploy-commands.js
require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// juntamos la data de todos los comandos
const commands = [];
const commandsPath = path.join(__dirname, 'commands');

for (const folder of fs.readdirSync(commandsPath)) {
    const folderPath = path.join(commandsPath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));

    for (const file of files) {
        const command = require(path.join(folderPath, file));
        // toJSON convierte el SlashCommandBuilder al formato que entiende discord
        if (command.data) commands.push(command.data.toJSON());
    }
}

// cliente para hablar con la api de discord
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`registrando ${commands.length} comandos...`);

        // en un servidor (al instante, para probar)
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        // global, en todos los servidores (puede tardar hasta 1 hora)
        // await rest.put(
        //     Routes.applicationCommands(process.env.CLIENT_ID),
        //     { body: commands },
        // );

        console.log(`comandos registrados: ${commands.length}`);
    } catch (error) {
        console.error(error);
    }
})();