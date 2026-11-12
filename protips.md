## formato de un comando

archivo en `commands/<categoria>/<nombre>.js`
```js
module.exports = {
  name: 'nombre',              // lo que se escribe despues del prefijo
  description: 'que hace',
  async execute(message, args, client) {
    // codigo del comando
  },
};

## formato de un evento
archivo en `events/<nombre>.js`
const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,  // cualquier Events.X
  once: false,                  // true = solo se ejecuta una vez
  async execute(...args) {
    // codigo del evento (el ultimo argumento siempre es client)
  },
};

# para agregar un comando nuevo
1. crear el archivo en `commands/<categoria>/`
2. reiniciar el bot
3. listo, no se toca nada mas

# conceptos
- **handler**: archivo que recorre una carpeta y carga lo que encuentra
- **collection**: un map de discord.js, guardamos nombre -> comando
- **module.exports**: lo que un archivo "exporta" para que otro lo use con require
- **args**: las palabras que van despues del comando (`!say hola mundo` -> `['hola', 'mundo']`)

# errores comunes
| error | solucion |
|---|---|
| `enoent: no such file or directory` | falta crear alguna carpeta (paso 1) |
| `comando cargado` no aparece | el archivo no termina en .js o le falta name/execute |
| `x is not a function` | el archivo no tiene `module.exports` |
| el comando no responde | revisar que el `name` sea igual a lo que escribis |

// COMO CREAR UN SLSH COMMANDS 
## formato de un comando
js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nombre')            // solo minusculas, sin espacios, max 32
    .setDescription('que hace'),  // obligatorio, max 100

  async execute(interaction, client) {
    await interaction.reply('respuesta');
  },
};
```

## tipos de opciones
| metodo | que pide | como se lee |
|---|---|---|
| `.addStringOption` | texto | `interaction.options.getString('x')` |
| `.addIntegerOption` | numero entero | `getInteger('x')` |
| `.addNumberOption` | numero con decimales | `getNumber('x')` |
| `.addBooleanOption` | si / no | `getBoolean('x')` |
| `.addUserOption` | usuario | `getUser('x')` / `getMember('x')` |
| `.addChannelOption` | canal | `getChannel('x')` |
| `.addRoleOption` | rol | `getRole('x')` |
| `.addMentionableOption` | usuario o rol | `getMentionable('x')` |
| `.addAttachmentOption` | archivo | `getAttachment('x')` |

## formas de responder
| metodo | para que |
|---|---|
| `interaction.reply('x')` | responder (obligatorio en menos de 3 segundos) |
| `reply({ content, flags: MessageFlags.Ephemeral })` | respuesta que solo ve quien uso el comando |
| `interaction.deferReply()` | "pensando..." si el comando tarda mas de 3 seg |
| `interaction.editReply('x')` | cambiar la respuesta (despues de reply o defer) |
| `interaction.followUp('x')` | mandar otro mensaje mas |

## errores comunes
| error | solucion |
|---|---|
| los comandos no aparecen | no corriste `node deploy-commands.js` o reiniciar discord (ctrl + r) |
| `missing access` en el deploy | el bot no se invito con el scope `applications.commands` (fase 00) |
| `la aplicacion no respondio` | el execute tardo mas de 3 seg, usar deferReply |
| `interaction has already been acknowledged` | respondiste dos veces con reply, usar editReply o followUp |
| `invalid form body` | nombre con mayusculas/espacios o falta la descripcion |

# NECESARIO PARA COMMANDS Y BASE DE DATOS
# como se usa en otros archivos
```js
// en un comando (commands/<categoria>/x.js)
const { obtenerConfig } = require('../../database/config');

// en un evento, boton, menu o modal (events/x.js, buttons/x.js, etc)
const { obtenerConfig } = require('../database/config');

const canalId = obtenerConfig(guild.id, 'canal_logs');
const canal = guild.channels.cache.get(canalId);
```

### pasar los eventos de la fase 04 del .env a la base de datos
en `events/guildMemberAdd.js`, cambiar:
```js
const canal = member.guild.channels.cache.get(process.env.CANAL_BIENVENIDA);
```
por:
```js
const { obtenerConfig } = require('../database/config'); // arriba de todo

const canal = member.guild.channels.cache.get(obtenerConfig(member.guild.id, 'canal_bienvenida'));
```
y lo mismo con `CANAL_LOGS` -> `'canal_logs'` y `CANAL_SUGERENCIAS` -> `'canal_sugerencias'`.
ahora cada servidor configura su canal con `/config` y el `.env` solo tiene el token

---

## sql basico
| que | sql |
|---|---|
| crear tabla | `CREATE TABLE IF NOT EXISTS x (col1 TEXT, col2 INTEGER)` |
| insertar | `INSERT INTO x (col1, col2) VALUES (?, ?)` |
| insertar si no existe | `INSERT OR IGNORE INTO x ...` |
| leer | `SELECT * FROM x WHERE col1 = ?` |
| actualizar | `UPDATE x SET col2 = ? WHERE col1 = ?` |
| borrar | `DELETE FROM x WHERE col1 = ?` |
| ordenar y limitar | `SELECT * FROM x ORDER BY col2 DESC LIMIT 10` |

### tipos de columnas
| tipo | para que |
|---|---|
| `TEXT` | texto y **ids de discord** (son muy largos para INTEGER en js) |
| `INTEGER` | numeros enteros, fechas en milisegundos, true/false (1/0) |
| `REAL` | numeros con decimales |

### metodos de better-sqlite3
| metodo | devuelve | para que |
|---|---|---|
| `db.prepare(sql)` | consulta preparada | armarla una vez y reusarla |
| `.get(...valores)` | un objeto o `undefined` | leer una fila |
| `.all(...valores)` | array de objetos | leer varias filas |
| `.run(...valores)` | `{ changes }` | insertar, actualizar, borrar |
| `db.exec(sql)` | nada | crear tablas |

⚠️ **siempre usar `?`** para los valores, nunca meterlos con `${}` en el texto del sql.
si un usuario escribe algo raro en un comando, con `${}` puede romper o borrar la base (sql injection)

## subcomandos
```js
new SlashCommandBuilder()
    .setName('config')
    .addSubcommand((sub) => sub.setName('ver').setDescription('...'))
    .addSubcommand((sub) => sub.setName('canal').setDescription('...').addChannelOption(...));

// en execute
const sub = interaction.options.getSubcommand(); // 'ver' o 'canal'
```
- un comando con subcomandos no puede tener opciones sueltas, van adentro de cada subcomando
- max 25 subcomandos por comando

## choices (opciones fijas)
```js
.addStringOption((option) =>
    option.setName('funcion').setDescription('...').addChoices(
        { name: 'lo que ve el usuario', value: 'lo que recibe el bot' },
    ),
)
```
max 25 choices

## agregar una tabla nueva
1. en `database/db.js` agregar otro `db.exec('CREATE TABLE IF NOT EXISTS ...')`
2. crear `database/<nombre>.js` con las funciones
3. reiniciar el bot

⚠️ `CREATE TABLE IF NOT EXISTS` no modifica tablas que ya existen. para agregar una columna a una tabla vieja:
```js
try { db.exec('ALTER TABLE usuarios ADD COLUMN xp INTEGER NOT NULL DEFAULT 0'); } catch {}
```
(el try es porque la segunda vez tira error de que la columna ya existe)

## ver la base de datos
programa gratis: **db browser for sqlite** (https://sqlitebrowser.org).
abrir `data/bot.db` y se ven las tablas como un excel

## backups
copiar `data/bot.db` (con el bot apagado). si se borra ese archivo, se pierden todos los datos

## errores comunes
| error | solucion |
|---|---|
| `could not locate the bindings file` / `node-gyp` | node viejo, actualizar a node 22 lts o usar `better-sqlite3@12` |
| `no such table` | la tabla no esta en db.js o falta `require('./database/db')` en index.js |
| `no such column` | agregaste la columna en db.js pero la tabla ya existia, usar ALTER TABLE |
| `unique constraint failed` | insertaste algo que ya existia, usar `INSERT OR IGNORE` u `ON CONFLICT` |
| `database is locked` | tenes la base abierta en db browser guardando cambios, cerrarlo |
| los datos se borran al reiniciar | el bot arranca desde otra carpeta, revisar `cwd` en pm2 (fase 05) |



# EMBEDS
# que agregar en otros archivos
- **nada en index.js**: el commandHandler carga los comandos solo
- **intents**: ninguno extra (con `Guilds` alcanza)
- **deploy**: correr `node deploy-commands.js` porque son comandos nuevos
- **para usar los embeds rapidos en otro comando**, agregar arriba de ese archivo:
```js
const { embedExito, embedError, embedAviso, embedInfo } = require('../../utils/embeds');
```
y usarlos asi:
```js
await interaction.reply({ embeds: [embedExito('todo salio bien')] });
```

---

## todas las propiedades
```
┌─────────────────────────────────────────┐
│ [icono] autor                [thumbnail]│
│ titulo (link)                           │
│ descripcion                             │
│                                         │
│ campo normal                            │
│ inline 1   inline 2   inline 3          │
│                                         │
│ [         imagen grande          ]      │
│ [icono] footer • timestamp              │
└─────────────────────────────────────────┘
```

| metodo | que hace | limite |
|---|---|---|
| `.setColor(color)` | color de la barra izquierda | - |
| `.setAuthor({ name, iconURL, url })` | texto chico arriba con icono | name: 256 |
| `.setTitle('x')` | titulo | 256 |
| `.setURL('https://...')` | link del titulo | - |
| `.setDescription('x')` | texto principal, acepta markdown | 4096 |
| `.setThumbnail(url)` | imagen chica arriba a la derecha | - |
| `.addFields({ name, value, inline })` | agrega campos | 25 campos, name: 256, value: 1024 |
| `.setFields(...)` | reemplaza todos los campos | - |
| `.spliceFields(indice, cantidad)` | borra campos | - |
| `.setImage(url)` | imagen grande abajo | - |
| `.setFooter({ text, iconURL })` | texto chico abajo | 2048 |
| `.setTimestamp()` | fecha y hora (sin parametro = ahora) | - |

⚠️ **limite total**: entre todo el texto del embed max 6000 caracteres, y max 10 embeds por mensaje

## formas de poner el color
```js
.setColor(0x5865f2)          // hex como numero
.setColor('#5865f2')         // hex como texto
.setColor([88, 101, 242])    // rgb
.setColor('Random')          // aleatorio
.setColor(Colors.Blurple)    // nombres de discord.js (importar Colors)
```
colores disponibles en `Colors`: Default, White, Aqua, Green, Blue, Yellow, Purple, LuminousVividPink, Fuchsia, Gold, Orange, Red, Grey, Navy, DarkAqua, DarkGreen, DarkBlue, DarkPurple, DarkVividPink, DarkGold, DarkOrange, DarkRed, DarkGrey, DarkerGrey, LightGrey, DarkNavy, Blurple, Greyple, DarkButNotBlack, NotQuiteBlack

## cosas utiles
### mandar varios embeds juntos
```js
await interaction.reply({ embeds: [embed1, embed2, embed3] });
```

### editar un embed que ya se mando
```js
const { EmbedBuilder } = require('discord.js');

// copiamos el embed original y le cambiamos lo que queramos
const nuevo = EmbedBuilder.from(mensaje.embeds[0]).setTitle('titulo nuevo');
await mensaje.edit({ embeds: [nuevo] });
```

### usar una imagen de tu pc
```js
const { AttachmentBuilder } = require('discord.js');

const archivo = new AttachmentBuilder('./imagenes/banner.png', { name: 'banner.png' });
embed.setImage('attachment://banner.png'); // el nombre tiene que coincidir

await interaction.reply({ embeds: [embed], files: [archivo] });
```

### campo vacio para separar
```js
{ name: '\u200B', value: '\u200B' } // \u200B es un caracter invisible
```

### fechas que se adaptan a la zona horaria de cada uno
```js
const segundos = Math.floor(Date.now() / 1000);
`<t:${segundos}:R>`  // "hace 5 minutos"
`<t:${segundos}:F>`  // "miercoles, 11 de noviembre de 2026 20:46"
```

## errores comunes
| error | solucion |
|---|---|
| `invalid form body ... embeds[0].description` | la descripcion esta vacia o pasa los 4096 |
| `received one or more errors` | algun campo sin `name` o `value`, o value vacio |
| la imagen no aparece | la url no es directa a la imagen (tiene que terminar en .png, .jpg, .gif) |
| `embeds is not iterable` | pusiste `embeds: embed` en vez de `embeds: [embed]` |
| `cannot find module '../../utils/embeds'` | falta crear `utils/embeds.js` en la raiz |