// carga las variables del archivo .env
require('dotenv').config();
// carga el antiCrash (para que no se caiga el bot si hay un error)
require('./handlers/antiCrash')();
// carga la base de datos (para que se cree si no existe)
require('./database/db');


// importamos lo que necesitamos de discord.js
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

// importamos los handlers
const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');

// creamos el bot (mismos intents y partials de la fase 01)
const client = new Client({
    intents: [
        // --- servidores ---
        GatewayIntentBits.Guilds,                       // servidores, canales, roles (siempre)
        GatewayIntentBits.GuildMembers,                 // ⚠️ privilegiado - entradas, salidas, roles de miembros
        GatewayIntentBits.GuildModeration,              // bans y unbans
        GatewayIntentBits.GuildExpressions,             // emojis, stickers y sonidos
        // GatewayIntentBits.GuildIntegrations,         // integraciones
        // GatewayIntentBits.GuildWebhooks,             // webhooks
        GatewayIntentBits.GuildInvites,                 // invitaciones creadas/borradas
        GatewayIntentBits.GuildVoiceStates,             // quien entra/sale de canales de voz
        GatewayIntentBits.GuildPresences,               // ⚠️ privilegiado - estado (online, jugando a...)
        GatewayIntentBits.GuildScheduledEvents,         // eventos programados del servidor

        // --- mensajes en servidores ---
        GatewayIntentBits.GuildMessages,                // mensajes
        GatewayIntentBits.GuildMessageReactions,        // reacciones
        GatewayIntentBits.GuildMessageTyping,           // "esta escribiendo..."
        GatewayIntentBits.GuildMessagePolls,            // encuestas
        GatewayIntentBits.MessageContent,               // ⚠️ privilegiado - leer el texto de los mensajes

        // --- mensajes directos (md) ---
        GatewayIntentBits.DirectMessages,               // mensajes por md
        GatewayIntentBits.DirectMessageReactions,       // reacciones en md
        GatewayIntentBits.DirectMessageTyping,          // "esta escribiendo..." en md
        GatewayIntentBits.DirectMessagePolls,           // encuestas en md

        // --- automod ---
        GatewayIntentBits.AutoModerationConfiguration,  // cambios en reglas de automod
        GatewayIntentBits.AutoModerationExecution,      // cuando automod actua
    ],
    // partials: deja recibir eventos de cosas que no estan en cache
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
    ],
});

// // el prefijo de los comandos
// client.prefix = '!';

// aca se guardan todos los comandos (nombre -> comando)
client.commands = new Collection();

// cargamos comandos y eventos
commandHandler(client);
eventHandler(client);

// conectamos el bot usando el token
client.login(process.env.TOKEN);