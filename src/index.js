const { Client, Events, GatewayIntentBits } = require("discord.js"); // trae el cliente (el bot), los nombres de los eventos y los intents
const ping = require("./commands/utiles/ping"); // importa el comando ping
process.loadEnvFile(); // carga las variables desde el archivo .env
const info = require("./info"); // importa el comando info

// archivos necesarios para que el bot funcione, como la librería discord.js, fs y path para manejar archivos y rutas, y dotenv para cargar las variables de entorno desde el archivo .env

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // lo básico: servidores, canales y comandos
    ]
});

// se ejecuta UNA vez, cuando el bot se conecta y esta pronto
client.once(Events.ClientReady, (bot) => {
    console.log(`Mord está conectado como ${bot.user.tag}`);
});

// se ejecuta CADA vez que alguien interactúa con el bot (comandos, botones, menús)
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return; // si no es un comando /, no hace nada

    if (interaction.commandName === ping.data.name) { // si el comando usado se llama "ping"...
        await ping.execute(interaction); //ejecuta ping.js
    }
    if (interaction.commandName === info.data.name) { // si el comando usado se llama "info"...
        await info.execute(interaction); // ejecuta info.js
    }
});

client.login(process.env.DISCORD_TOKEN); // se conecta a Discord con el token, desde acá el bot queda prendido