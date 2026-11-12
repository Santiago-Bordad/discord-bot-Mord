// embeds listos para usar en cualquier comando (exito, error, aviso, info)
// uso: const { embedExito } = require('../../utils/embeds');
const { EmbedBuilder, Colors } = require('discord.js');

// base: color + descripcion + hora
function crearBase(color, emoji, texto) {
    return new EmbedBuilder()
        .setColor(color)
        .setDescription(`${emoji} ${texto}`)
        .setTimestamp();
}

module.exports = {
    embedExito: (texto) => crearBase(Colors.Green, '✅', texto),
    embedError: (texto) => crearBase(Colors.Red, '❌', texto),
    embedAviso: (texto) => crearBase(Colors.Yellow, '⚠️', texto),
    embedInfo: (texto) => crearBase(Colors.Blurple, 'ℹ️', texto),
};