// recorre events/ y conecta cada archivo con client.on o client.once
const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
    // ruta a la carpeta events
    const eventsPath = path.join(__dirname, '..', 'events');

    // agarramos solo los archivos .js
    const files = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

    for (const file of files) {
        const event = require(path.join(eventsPath, file));

        // once = solo una vez, on = cada vez que pase
        // le pasamos los argumentos del evento y al final el client
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }

        console.log(`evento cargado: ${event.name}`);
    }
};