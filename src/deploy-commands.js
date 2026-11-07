const { REST, Routes } = require('discord.js'); // trae la herramienta para crear comandos
const ping = require('./commands/utiles/ping'); // importa el comando ping desde su archivo correspondiente
const info = require('./info');process.loadEnvFile(); // carga las variables desde el archivo .env
const commands = [ping.data.toJSON(), info.data.toJSON()]; // crea un array con los comandos que se van a registrar

new REST() .setToken(process.env.DISCORD_TOKEN) // setea el token del bot para poder registrar los comandos
    .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands }) // registra los comandos en la aplicación del bot
    .then((registrados) => console.log(`Comandos registrados correctamente: ${registrados.length}`)) // si se registran correctamente, se imprime un mensaje en la consola
    .catch(console.error); // si hay un error, se imprime en la consola

// ------------------------------------
// todo esto es lo que hace el archivo deploy-commands.js, que es registrar los comandos del bot en la aplicación de Discord, para que puedan ser usados por los usuarios.
// -------------------------------------

// dsp de esto, el bot ya registra los comandos pero no lo puede ejecutar porque no está prendido, por eso, el index.js es el que prende el bot y lo deja a la escucha de los comandos que se registraron en este archivo.
