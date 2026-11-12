// recorre todas las carpetas de commands/ y guarda cada comando en client.commands
const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
    // ruta a la carpeta commands
    const commandsPath = path.join(__dirname, '..', 'commands');

    // recorremos cada categoria (utilidades, moderacion, etc)
    for (const folder of fs.readdirSync(commandsPath)) {
        const folderPath = path.join(commandsPath, folder);

        // si no es una carpeta la salteamos
        if (!fs.statSync(folderPath).isDirectory()) continue;

        // agarramos solo los archivos .js
        const files = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));

        for (const file of files) {
            const command = require(path.join(folderPath, file));

            // ahora el nombre esta adentro de data (el SlashCommandBuilder)
            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
                console.log(`comando cargado: /${command.data.name}`);
            } else {
                console.warn(`⚠️ ${file} no tiene data o execute`);
            }
        }
    }
};