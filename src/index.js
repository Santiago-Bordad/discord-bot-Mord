const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require("discord.js"); // trae el cliente (el bot), los nombres de los eventos y los intents
const ping = require("./commands/utiles/ping"); // importa el comando ping
process.loadEnvFile(); // carga las variables desde el archivo .env
const info = require("./commands/utiles/info"); // importa el comando info
const fs = require("node:fs"); // trae la librería para manejar archivos
const path = require("node:path"); // trae la librería para manejar rutas de archivos

// archivos necesarios para que el bot funcione, como la librería discord.js, fs y path para manejar archivos y rutas, y dotenv para cargar las variables de entorno desde el archivo .env

const commandsPath = path.join(__dirname, "commands"); // ruta a la carpeta de comandos
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")); // lee los archivos de la carpeta de comandos y filtra los que terminan en .js



const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // lo básico: servidores, canales y comandos
    ]
});

client.commands = new Collection(); // crea una colección para guardar los comandos del bot
const CarpetaComandos = path.join(__dirname, "commands"); // obtiene la ruta de la carpeta de comandos
const categorias = fs.readdirSync(CarpetaComandos); // lee las carpetas de la carpeta de comandos

for (const categoria of categorias) { // recorre cada carpeta de categoría
    const carpetaCategoria = path.join(CarpetaComandos, categoria); // ruta completa: src/commands/utiles
    const archivos = fs
        .readdirSync(carpetaCategoria) // los archivos de esa carpeta: ["ping.js"]
        .filter((archivo) => archivo.endsWith(".js")); // se queda solo con los .js

    for (const archivo of archivos) { // recorre cada archivo de esa categoría
        const rutaArchivo = path.join(carpetaCategoria, archivo); // ruta completa: src/commands/utiles/ping.js
        const comando = require(rutaArchivo); // lo carga: el objeto { data, execute }

        if ("data" in comando && "execute" in comando) { // si tiene la forma de un comando...
            client.commands.set(comando.data.name, comando); // ...lo guarda en la agenda con su nombre
        } else {
            console.warn(`[AVISO] ${rutaArchivo} no tiene "data" o "execute", así que no se cargó`);
        }
    }
}

console.log(`Comandos cargados: ${client.commands.size}`); // cuántos encontró


// se ejecuta UNA vez, cuando el bot se conecta y esta pronto
client.once(Events.ClientReady, (bot) => {
    console.log(`Mord está conectado como ${bot.user.tag}`);
});



// se ejecuta CADA vez que alguien interactúa con el bot (comandos, botones, menús)
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return; // si no es un comando /, no hace nada

    const comando = interaction.client.commands.get(interaction.commandName); // busca el comando en la agenda

    if (!comando) {
        console.error(`No existe un comando llamado "${interaction.commandName}"`);
        return;
    }

    try {
        await comando.execute(interaction); // intenta ejecutar el comando
    } catch (error) { // si algo falló adentro del comando, se viene acá
        console.error(`Error en /${interaction.commandName}:`, error); // para vos, en la terminal

        const mensajeError = { // el aviso para el usuario
            content: "Hubo un error al ejecutar este comando.",
            flags: MessageFlags.Ephemeral, // solo lo ve quien usó el comando
        };

        if (interaction.replied || interaction.deferred) { // si el comando ya había respondido...
            await interaction.followUp(mensajeError); // ...se manda como un mensaje más
        } else {
            await interaction.reply(mensajeError); // si no, como la respuesta
        }
    }
});

client.login(process.env.DISCORD_TOKEN); // se conecta a Discord con el token, desde acá el bot queda prendido