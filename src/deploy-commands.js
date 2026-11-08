const fs = require("node:fs"); // herramientas para leer carpetas y archivos (viene con Node)
const path = require("node:path"); // herramientas para armar rutas que funcionan en Windows y Mac
const { REST, Routes } = require('discord.js'); // trae la herramienta para crear comandos
process.loadEnvFile(); // carga las variables de entorno desde el archivo .env

const commands = []; // crea un array con los comandos que se van a registrar (arranca vacío y el recorrido lo llena)

const carpetaComandos = path.join(__dirname, "commands"); // la ruta completa a src/commands
const categorias = fs.readdirSync(carpetaComandos); // lo que hay adentro: ["utiles"]

for (const categoria of categorias) { // recorre cada carpeta de categoría
    const carpetaCategoria = path.join(carpetaComandos, categoria); // ruta completa: src/commands/utiles
    const archivos = fs
        .readdirSync(carpetaCategoria) // los archivos de esa carpeta: ["ping.js"]
        .filter((archivo) => archivo.endsWith(".js")); // se queda solo con los .js

    for (const archivo of archivos) { // recorre cada archivo de esa categoría
        const rutaArchivo = path.join(carpetaCategoria, archivo); // ruta completa: src/commands/utiles/ping.js
        const comando = require(rutaArchivo); // lo carga: el objeto { data, execute }

        if ("data" in comando && "execute" in comando) { // si tiene la forma de un comando...
            commands.push(comando.data.toJSON()); // ...agrega su descripción al final del array
        } else {
            console.warn(`[AVISO] ${rutaArchivo} no tiene "data" o "execute", así que no se registró`);
        }
    }
}

new REST().setToken(process.env.DISCORD_TOKEN) // setea el token del bot para poder registrar los comandos
    .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands }) // registra los comandos en la aplicación del bot
    .then((registrados) => console.log(`Comandos registrados correctamente: ${registrados.length}`)) // si se registran correctamente, se imprime un mensaje en la consola
    .catch(console.error); // si hay un error, se imprime en la consola