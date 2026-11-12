// conexion a la base de datos sqlite y creacion de tablas
// uso: const db = require('../../database/db');
const Database = require('better-sqlite3');
const fs = require('node:fs');
const path = require('node:path');

// la base de datos es un archivo: data/bot.db (si no existe, se crea)
const carpeta = path.join(__dirname, '..', 'data');
if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta);

const db = new Database(path.join(carpeta, 'bot.db'));

// modo wal: mas rapido y aguanta mejor lecturas y escrituras al mismo tiempo
db.pragma('journal_mode = WAL');

// --- tablas ---
// "if not exists" = solo se crea la primera vez, despues no hace nada

// configuracion de cada servidor (un valor por clave)
db.exec(`
    CREATE TABLE IF NOT EXISTS config (
        guild_id TEXT NOT NULL,
        clave    TEXT NOT NULL,
        valor    TEXT,
        PRIMARY KEY (guild_id, clave)
    )
`);

// datos de cada usuario en cada servidor
db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        guild_id     TEXT NOT NULL,
        user_id      TEXT NOT NULL,
        monedas      INTEGER NOT NULL DEFAULT 0,
        ultimo_daily INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (guild_id, user_id)
    )
`);

console.log('base de datos conectada');

module.exports = db;