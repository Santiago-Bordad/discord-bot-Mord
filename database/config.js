// funciones para leer y guardar la configuracion de cada servidor
const db = require('./db');

// preparamos las consultas una sola vez (es mas rapido que armarlas cada vez)
const consultas = {
    obtener: db.prepare('SELECT valor FROM config WHERE guild_id = ? AND clave = ?'),
    guardar: db.prepare(`
        INSERT INTO config (guild_id, clave, valor) VALUES (?, ?, ?)
        ON CONFLICT (guild_id, clave) DO UPDATE SET valor = excluded.valor
    `),
    borrar: db.prepare('DELETE FROM config WHERE guild_id = ? AND clave = ?'),
    todas: db.prepare('SELECT clave, valor FROM config WHERE guild_id = ?'),
};

module.exports = {
    // devuelve el valor o null si no existe
    obtenerConfig: (guildId, clave) => consultas.obtener.get(guildId, clave)?.valor ?? null,

    // crea o actualiza (si ya existia la pisa)
    guardarConfig: (guildId, clave, valor) => consultas.guardar.run(guildId, clave, valor),

    borrarConfig: (guildId, clave) => consultas.borrar.run(guildId, clave),

    // array de { clave, valor }
    todaLaConfig: (guildId) => consultas.todas.all(guildId),
};