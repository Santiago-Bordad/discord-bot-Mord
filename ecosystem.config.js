// configuracion de pm2
// se usa con: pm2 start ecosystem.config.js

module.exports = {
    apps: [
        {
            name: 'mord',               // nombre para los comandos de pm2 (cambialo)
            script: 'index.js',           // archivo que arranca el bot
            cwd: __dirname,               // carpeta del proyecto (para que encuentre el .env)

            autorestart: true,            // si se cae, lo vuelve a prender
            max_restarts: 10,             // maximo de reinicios seguidos si falla al arrancar
            restart_delay: 5000,          // espera 5 seg entre reinicios
            max_memory_restart: '300M',   // si usa mas de 300mb de ram, lo reinicia

            watch: false,                 // true = reinicia solo al cambiar archivos (no usar en produccion)

            time: true,                   // agrega la hora a cada linea de los logs
        },
    ],
};