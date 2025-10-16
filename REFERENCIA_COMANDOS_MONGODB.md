# Referencia Rápida de Comandos MongoDB

## Conexión

| Comando | Descripción | Uso | Sintaxis |
|---------|-------------|-----|----------|
| `mongosh` | Iniciar shell de MongoDB | Conectar a MongoDB local | `mongosh` |
| `mongosh --host` | Conectar a un servidor remoto | Especificar host y puerto | `mongosh --host <host> --port <puerto>` |
| `mongosh "mongodb://..."` | Cadena de conexión completa | Conexión con autenticación | `mongosh "mongodb://usuario:contraseña@host:puerto/bd"` |
| `help` | Mostrar ayuda general | Ver comandos disponibles | `help` |
| `exit` o `quit` | Salir de MongoDB Shell | Cerrar la sesión actual | `exit` |

## Bases de Datos

| Comando | Descripción | Uso | Sintaxis |
|---------|-------------|-----|----------|
| `show dbs` | Mostrar bases de datos | Ver todas las BDs | `show dbs` |
| `use <db>` | Cambiar a una base de datos | Crear/Seleccionar BD | `use mi_bd` |
| `db` | Mostrar base de datos actual | Ver BD en uso | `db` |
| `db.dropDatabase()` | Eliminar BD actual | Borrar BD actual | `db.dropDatabase()` |

## Colecciones

| Comando | Descripción | Uso | Sintaxis |
|---------|-------------|-----|----------|
| `show collections` | Mostrar colecciones | Ver colecciones en BD actual | `show collections` |
| `db.createCollection()` | Crear colección | Crear nueva colección | `db.createCollection("usuarios")` |
| `db.<coleccion>.drop()` | Eliminar colección | Borrar colección | `db.usuarios.drop()` |
| `db.<coleccion>.count()` | Contar documentos | Número de documentos | `db.usuarios.count()` |

## Operaciones CRUD

### Insertar

| Comando | Descripción | Uso | Sintaxis |
|---------|-------------|-----|----------|
| `insertOne()` | Insertar un documento | Añadir un documento | `db.usuarios.insertOne({nombre: "Juan"})` |
| `insertMany()` | Insertar varios documentos | Añadir múltiples documentos | `db.usuarios.insertMany([{...}, {...}])` |

### Consultar

| Comando | Descripción | Uso | Sintaxis |
|---------|-------------|-----|----------|
| `find()` | Buscar documentos | Obtener todos los documentos | `db.usuarios.find()` |
| `findOne()` | Buscar un documento | Obtener primer documento | `db.usuarios.findOne({edad: 25})` |
| `pretty()` | Formatear salida | Mejor legibilidad | `db.usuarios.find().pretty()` |

### Actualizar

| Comando | Descripción | Uso | Sintaxis |
|---------|-------------|-----|----------|
| `updateOne()` | Actualizar un documento | Modificar un documento | `db.usuarios.updateOne({...}, {$set: {...}})` |
| `updateMany()` | Actualizar varios | Modificar múltiples documentos | `db.usuarios.updateMany({...}, {$set: {...}})` |
| `replaceOne()` | Reemplazar documento | Sustituir documento completo | `db.usuarios.replaceOne({...}, {...nuevo...})` |

### Eliminar

| Comando | Descripción | Uso | Sintaxis |
|---------|-------------|-----|----------|
| `deleteOne()` | Eliminar un documento | Borrar un documento | `db.usuarios.deleteOne({_id: 1})` |
| `deleteMany()` | Eliminar varios | Borrar múltiples documentos | `db.usuarios.deleteMany({activo: false})` |

## Consultas Avanzadas

### Operadores de Comparación

| Operador | Descripción | Ejemplo |
|----------|-------------|----------|
| `$eq` | Igual a | `{edad: {$eq: 25}}` |
| `$gt` | Mayor que | `{edad: {$gt: 20}}` |
| `$lt` | Menor que | `{edad: {$lt: 65}}` |
| `$in` | En una lista | `{nombre: {$in: ["Ana", "Juan"]}}` |

### Operadores Lógicos

| Operador | Descripción | Ejemplo |
|----------|-------------|----------|
| `$and` | Y lógico | `{$and: [{edad: {$gt: 20}}, {edad: {$lt: 30}}]}` |
| `$or` | O lógico | `{$or: [{ciudad: "Madrid"}, {ciudad: "Barcelona"}]}` |
| `$not` | Negación | `{edad: {$not: {$lt: 18}}}` |

### Orden y Límites

| Comando | Descripción | Uso | Sintaxis |
|---------|-------------|-----|----------|
| `sort()` | Ordenar resultados | Orden ascendente/descendente | `db.usuarios.find().sort({edad: 1})` |
| `limit()` | Limitar resultados | Número máximo de resultados | `db.usuarios.find().limit(10)` |
| `skip()` | Saltar documentos | Paginación | `db.usuarios.find().skip(20).limit(10)` |

## Índices

| Comando | Descripción | Uso | Sintaxis |
|---------|-------------|-----|----------|
| `createIndex()` | Crear índice | Mejorar rendimiento | `db.usuarios.createIndex({email: 1})` |
| `getIndexes()` | Ver índices | Listar índices | `db.usuarios.getIndexes()` |
| `dropIndex()` | Eliminar índice | Quitar índice | `db.usuarios.dropIndex("email_1")` |

## Agregaciones

| Etapa | Descripción | Ejemplo |
|-------|-------------|----------|
| `$match` | Filtrar documentos | `{$match: {edad: {$gt: 25}}}` |
| `$group` | Agrupar documentos | `{$group: {_id: "$ciudad", total: {$sum: 1}}}` |
| `$sort` | Ordenar resultados | `{$sort: {total: -1}}` |
| `$project` | Seleccionar campos | `{$project: {nombre: 1, email: 1, _id: 0}}` |
| `$lookup` | Unir colecciones | `{$lookup: {from: "productos", localField: "producto_id", foreignField: "_id", as: "producto"}}` |

## Usuarios y Seguridad

| Comando | Descripción | Uso | Sintaxis |
|---------|-------------|-----|----------|
| `createUser()` | Crear usuario | Añadir usuario | `db.createUser({user: "admin", pwd: "1234", roles: ["root"]})` |
| `getUsers()` | Listar usuarios | Ver usuarios | `db.getUsers()` |
| `dropUser()` | Eliminar usuario | Borrar usuario | `db.dropUser("usuario")` |

## Herramientas de Diagnóstico

| Comando | Descripción | Uso | Sintaxis |
|---------|-------------|-----|----------|
| `explain()` | Ver plan de ejecución | Analizar consulta | `db.usuarios.find().explain()` |
| `stats()` | Estadísticas | Ver estadísticas | `db.usuarios.stats()` |
| `serverStatus()` | Estado del servidor | Ver estado | `db.serverStatus()` |

## Exportación/Importación

| Comando | Descripción | Uso |
|---------|-------------|-----|
| `mongodump` | Exportar base de datos | `mongodump --db=mi_bd --out=/backup` |
| `mongorestore` | Importar base de datos | `mongorestore /backup/mi_bd` |
| `mongoexport` | Exportar a JSON/CSV | `mongoexport --collection=usuarios --db=mi_bd --out=usuarios.json` |
| `mongoimport` | Importar desde JSON/CSV | `mongoimport --collection=usuarios --db=mi_bd --file=usuarios.json` |

---

**Nota:** Los comandos que comienzan con `db.` deben ejecutarse dentro de MongoDB Shell. Los comandos como `mongodump` y `mongoexport` se ejecutan desde la línea de comandos del sistema operativo.

Para más información, consulta la [documentación oficial de MongoDB](https://www.mongodb.com/docs/).
