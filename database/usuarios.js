// funciones para leer y guardar datos de usuarios
const db = require('./db');

const consultas = {
    // si el usuario no existe lo crea con los valores por defecto, si existe no hace nada
    crear: db.prepare('INSERT OR IGNORE INTO usuarios (guild_id, user_id) VALUES (?, ?)'),
    obtener: db.prepare('SELECT * FROM usuarios WHERE guild_id = ? AND user_id = ?'),
    sumarMonedas: db.prepare('UPDATE usuarios SET monedas = monedas + ? WHERE guild_id = ? AND user_id = ?'),
    guardarDaily: db.prepare('UPDATE usuarios SET ultimo_daily = ? WHERE guild_id = ? AND user_id = ?'),
    top: db.prepare('SELECT user_id, monedas FROM usuarios WHERE guild_id = ? ORDER BY monedas DESC LIMIT ?'),
};

// devuelve el usuario (si no existia, lo crea primero)
function obtenerUsuario(guildId, userId) {
    consultas.crear.run(guildId, userId);
    return consultas.obtener.get(guildId, userId);
}

module.exports = {
    obtenerUsuario,

    sumarMonedas: (guildId, userId, cantidad) => {
        obtenerUsuario(guildId, userId);
        consultas.sumarMonedas.run(cantidad, guildId, userId);
    },

    guardarDaily: (guildId, userId, momento) => consultas.guardarDaily.run(momento, guildId, userId),

    topMonedas: (guildId, cantidad = 10) => consultas.top.all(guildId, cantidad),
};