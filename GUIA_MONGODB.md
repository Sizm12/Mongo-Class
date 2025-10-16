# Guía de Comandos Básicos de MongoDB Shell

## Tabla de Contenidos
1. [Conexión a MongoDB](#conexión-a-mongodb)
2. [Bases de Datos](#bases-de-datos)
3. [Colecciones](#colecciones)
4. [Operaciones CRUD](#operaciones-crud)
5. [Consultas Básicas](#consultas-básicas)
6. [Operadores de Consulta](#operadores-de-consulta)
7. [Ordenamiento y Límites](#ordenamiento-y-límites)
8. [Índices](#índices)
9. [Usuarios y Roles](#usuarios-y-roles)

## Conexión a MongoDB

### Conectar a MongoDB Shell
```bash
mongosh "mongodb://usuario:contraseña@localhost:27017"
```

### Mostrar ayuda
```
help
```

## Bases de Datos

### Mostrar bases de datos
```
show dbs
```

### Crear/Seleccionar base de datos
```
use mi_base_de_datos
```

### Ver base de datos actual
```
db
```

### Eliminar base de datos
```
db.dropDatabase()
```

## Colecciones

### Mostrar colecciones
```
show collections
```

### Crear colección
```
db.createCollection("usuarios")
```

### Eliminar colección
```
db.usuarios.drop()
```

## Operaciones CRUD

### Insertar documentos
```
// Insertar un documento
db.usuarios.insertOne({
  nombre: "Juan Pérez",
  email: "juan@ejemplo.com",
  edad: 30,
  activo: true,
  fecha_registro: new Date()
})

// Insertar varios documentos
db.usuarios.insertMany([
  { nombre: "Ana García", edad: 28 },
  { nombre: "Carlos López", edad: 35 }
])
```

### Consultar documentos
```
// Mostrar todos los documentos
db.usuarios.find()

// Formato más legible
db.usuarios.find().pretty()

// Buscar con filtro
db.usuarios.find({ edad: { $gt: 25 } })

// Buscar un solo documento
db.usuarios.findOne({ email: "juan@ejemplo.com" })
```

### Actualizar documentos
```
// Actualizar un documento
db.usuarios.updateOne(
  { email: "juan@ejemplo.com" },
  { $set: { edad: 31 } }
)

// Actualizar varios documentos
db.usuarios.updateMany(
  { activo: true },
  { $inc: { puntos: 10 } }
)

// Reemplazar documento
db.usuarios.replaceOne(
  { email: "juan@ejemplo.com" },
  { nombre: "Juan Pérez", email: "juan@ejemplo.com", edad: 32 }
)
```

### Eliminar documentos
```
// Eliminar un documento
db.usuarios.deleteOne({ email: "juan@ejemplo.com" })

// Eliminar varios documentos
db.usuarios.deleteMany({ activo: false })

// Eliminar todos los documentos (vaciar colección)
db.usuarios.deleteMany({})
```

## Consultas Avanzadas

### Operadores de comparación
```
// Mayores de 25 y menores o iguales a 40
db.usuarios.find({ edad: { $gt: 25, $lte: 40 } })

// Buscar en una lista de valores
db.usuarios.find({ nombre: { $in: ["Ana", "Juan"] } })

// Distinto de
db.usuarios.find({ edad: { $ne: 30 } })
```

### Operadores lógicos
```
// AND (implícito)
db.usuarios.find({ edad: { $gt: 20, $lt: 30 } })

// OR
db.usuarios.find({
  $or: [
    { nombre: "Ana García" },
    { edad: { $gt: 30 } }
  ]
})

// NOT
db.usuarios.find({ edad: { $not: { $lt: 25 } } })
```

### Búsqueda en arrays
```
// Elemento en array
db.usuarios.find({ intereses: "programación" })

// Tamaño del array
db.usuarios.find({ intereses: { $size: 3 } })

// Todos los elementos del array
db.usuarios.find({ intereses: { $all: ["programación", "música"] } })
```

### Proyecciones
```
// Incluir solo ciertos campos
db.usuarios.find(
  { edad: { $gt: 25 } },
  { nombre: 1, email: 1, _id: 0 }
)

// Excluir campos
db.usuarios.find({}, { contraseña: 0 })
```

### Ordenamiento y límites
```
// Ordenar por edad (1: ascendente, -1: descendente)
db.usuarios.find().sort({ edad: 1 })

// Limitar resultados a 10
db.usuarios.find().limit(10)

// Saltar los primeros 5 resultados
db.usuarios.find().skip(5)

// Paginación (página 2, 10 resultados por página)
db.usuarios.find()
  .sort({ fecha_registro: -1 })
  .skip(10)
  .limit(10)
```

## Índices

### Crear índices
```
// Índice simple (1: ascendente, -1: descendente)
db.usuarios.createIndex({ email: 1 })

// Índice compuesto
db.usuarios.createIndex({ apellido: 1, nombre: 1 })

// Índice único
db.usuarios.createIndex({ email: 1 }, { unique: true })

// Índice de texto para búsqueda
db.productos.createIndex(
  { nombre: "text", descripcion: "text" },
  { default_language: "spanish" }
)
```

### Ver índices
```
db.usuarios.getIndexes()
```

### Eliminar índice
```
db.usuarios.dropIndex("email_1")
```

## Agregaciones

### Ejemplo básico de agregación
```
// Contar usuarios por ciudad
db.usuarios.aggregate([
  { $group: {
    _id: "$ciudad",
    total: { $sum: 1 }
  }}
])
```

### Etapas comunes

#### $match (Filtrar)
```
db.ventas.aggregate([
  { $match: { fecha: { $gte: new Date("2023-01-01") } } }
])
```

#### $group (Agrupar)
```
// Total de ventas por producto
db.ventas.aggregate([
  { $group: {
    _id: "$producto_id",
    total_ventas: { $sum: "$cantidad" },
    ingresos: { $sum: { $multiply: ["$precio", "$cantidad"] } }
  }}
])
```

#### $sort (Ordenar)
```
// Ordenar por total de ventas descendente
{ $sort: { total_ventas: -1 } }
```

#### $limit y $skip
```
// Top 10 productos más vendidos
db.ventas.aggregate([
  { $group: { _id: "$producto_id", total: { $sum: "$cantidad" } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
])
```

#### $lookup (Join entre colecciones)
```
// Unir colecciones ventas y productos
db.ventas.aggregate([
  {
    $lookup: {
      from: "productos",
      localField: "producto_id",
      foreignField: "_id",
      as: "producto"
    }
  }
])
```

## Usuarios y Roles

### Crear usuario
```
use admin
db.createUser({
  user: "admin",
  pwd: "contraseña_segura",
  roles: ["root"]
})
```

### Crear usuario con roles específicos
```
use mi_base_de_datos
db.createUser({
  user: "app_user",
  pwd: "otra_contraseña",
  roles: ["readWrite"]
})
```

### Ver usuarios
```
use admin
db.getUsers()
```

### Eliminar usuario
```
use admin
db.dropUser("usuario")
```

## Comandos Útiles

### Contar documentos
```
db.usuarios.countDocuments()
db.usuarios.countDocuments({ edad: { $gt: 30 } })
```

### Ver estadísticas de colección
```
db.usuarios.stats()
```

### Verificar consultas
```
// Ver plan de ejecución
db.usuarios.find({ edad: { $gt: 30 } }).explain()

// Ver tiempo de ejecución
db.usuarios.find({ edad: { $gt: 30 } }).explain("executionStats")
```

## Exportar e importar datos

### Exportar colección
```bash
mongodump --db=mi_base_de_datos --collection=usuarios --out=/ruta/backup
```

### Importar colección
```bash
mongorestore --db=mi_base_de_datos /ruta/backup/mi_base_de_datos/usuarios.bson
```

## Consejos Rápidos

1. Usa `.pretty()` para mejor legibilidad
2. Presiona la tecla de flecha arriba para ver comandos anteriores
3. Usa `Tab` para autocompletar
4. Los comandos son sensibles a mayúsculas y minúsculas
5. Los nombres de campos con espacios necesitan comillas: `{ "nombre completo": "Juan Pérez" }`

---

Para más información, consulta la [documentación oficial de MongoDB](https://www.mongodb.com/docs/).

---

Esta guía es un punto de partida para trabajar con MongoDB. Para dominar completamente la base de datos, se recomienda practicar con conjuntos de datos reales y explorar características avanzadas como transacciones, cambio de flujos y sharding.
