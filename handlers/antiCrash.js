// atrapa los errores que nadie manejo para que el bot no se apague
// se llama una sola vez al principio de index.js

module.exports = () => {
    // una promesa fallo y nadie hizo catch (el mas comun, ej: falta un await o un try)
    process.on('unhandledRejection', (reason) => {
        console.error('[anticrash] unhandledRejection:', reason);
    });

    // un error que nadie atrapo
    process.on('uncaughtException', (error) => {
        console.error('[anticrash] uncaughtException:', error);
    });

    // avisos de node (no son errores, pero conviene verlos)
    process.on('warning', (warning) => {
        console.warn('[anticrash] warning:', warning.name, warning.message);
    });

    console.log('anticrash cargado');
};