# Introducción a MongoDB

MongoDB es una base de datos NoSQL orientada a documentos que proporciona alto rendimiento, alta disponibilidad y escalabilidad fácil. Utiliza un modelo de datos de documentos flexibles, lo que significa que los campos pueden variar de un documento a otro.

## Objetivos de Aprendizaje

- Profundizar en la Base de Datos No SQL Orientada a Objetos más popular.
- Entender la estructura del esquema que usa MongoDB.
- Familiarizarse con el lenguaje de consulta.
- Realizar diseño de esquemas.

## Contenido

### 1. Introducción a MongoDB

**¿Qué es MongoDB?**
MongoDB es una base de datos de documentos que ofrece un alto rendimiento, alta disponibilidad y escalabilidad automática. A diferencia de las bases de datos relacionales, MongoDB utiliza documentos similares a JSON con esquemas dinámicos.

**Características principales:**
- Modelo de datos basado en documentos (formato BSON)
- Alto rendimiento en operaciones de lectura/escritura
- Escalabilidad horizontal mediante sharding
- Consultas ad-hoc ricas e indexación
- Replicación y alta disponibilidad
- Soporte para múltiples motores de almacenamiento

**Casos de uso comunes:**
- Aplicaciones web y móviles
- Gestión de contenidos
- Almacenamiento de perfiles de usuario
- Análisis en tiempo real
- Almacenamiento de datos de sensores y IoT
- Catálogos de productos

**Ventajas sobre bases de datos relacionales:**
- Esquema flexible
- Escalabilidad horizontal más sencilla
- Mejor rendimiento para ciertas cargas de trabajo
- Modelo de datos más intuitivo para desarrolladores
- Facilidad de distribución geográfica

### 2. Estructura de trabajo

**Instalación y configuración:**
1. Descargar e instalar MongoDB Community Server desde [mongodb.com](https://www.mongodb.com/try/download/community)
2. Configurar el servicio de MongoDB como servicio de Windows
3. Instalar MongoDB Compass (interfaz gráfica opcional)
4. Verificar la instalación ejecutando `mongod --version` en la terminal

**Comandos básicos de MongoDB Shell:**
```javascript
// Conectar a MongoDB local
mongosh

// Mostrar bases de datos
db.adminCommand('listDatabases')

// Usar o crear una base de datos
use miBaseDeDatos

// Mostrar colecciones en la base de datos actual
show collections

// Ver estadísticas de la base de datos actual
db.stats()
```

**Gestión de bases de datos y colecciones:**
- Crear una nueva colección:
  ```javascript
  db.createCollection("usuarios")
  ```
- Eliminar una colección:
  ```javascript
  db.usuarios.drop()
  ```
- Crear un índice:
  ```javascript
  db.usuarios.createIndex({ email: 1 }, { unique: true })
  ```
- Ver índices de una colección:
  ```javascript
  db.usuarios.getIndexes()
  ```

**Tipos de datos en MongoDB:**
- **String**: Cadenas de texto UTF-8
- **Integer**: Números enteros (32 o 64 bits)
- **Double**: Números de punto flotante
- **Boolean**: true/false
- **Array**: Listas de valores
- **Object**: Documentos embebidos
- **Date**: Fechas y horas
- **ObjectId**: Identificador único de 12 bytes
- **Null**: Valores nulos
- **Timestamp**: Marca de tiempo interna
- **Binary data**: Datos binarios
- **Regular expression**: Expresiones regulares
- **JavaScript**: Código ejecutable
- **MinKey/MaxKey**: Valores de comparación
- **Decimal128**: Números decimales de alta precisión

**Estructura de directorios típica:**
- **/data/db**: Directorio por defecto para almacenamiento de datos
- **/bin**: Ejecutables de MongoDB (mongod, mongo, mongos, etc.)
- **/log**: Archivos de registro
- **/config**: Archivos de configuración

**Archivos de configuración importantes:**
- `mongod.conf`: Configuración del servidor MongoDB
- `.mongorc.js`: Script de inicio de la shell de MongoDB
- `mongod.log`: Archivo de registro principal

**Variables de entorno útiles:**
- `MONGO_HOME`: Directorio de instalación de MongoDB
- `PATH`: Debe incluir la ruta a los binarios de MongoDB
- `MONGO_URI`: Cadena de conexión a la base de datos

**Herramientas de línea de comandos:**
- `mongod`: Proceso principal de la base de datos
- `mongosh`: Shell interactivo de MongoDB
- `mongodump/mongorestore`: Para respaldo y restauración
- `mongoexport/mongoimport`: Para exportar/importar datos
- `mongostat/mongotop`: Para monitoreo

### 3. MongoDB Query Language (MQL)

MongoDB Query Language (MQL) es el lenguaje que permite interactuar con MongoDB para realizar operaciones CRUD, consultas y agregaciones.

#### Operaciones CRUD

**Create (Insertar):**
```javascript
// Insertar un documento
db.usuarios.insertOne({
  nombre: "Juan Pérez",
  email: "juan@ejemplo.com",
  edad: 30,
  direccion: {
    calle: "Av. Principal",
    ciudad: "Ciudad de México"
  },
  intereses: ["programación", "música", "deportes"]
})

// Insertar múltiples documentos
db.usuarios.insertMany([
  { nombre: "Ana García", edad: 25 },
  { nombre: "Carlos López", edad: 35 }
])
```

**Read (Consultar):**
```javascript
// Encontrar todos los documentos
db.usuarios.find()

// Encontrar con filtro
db.usuarios.find({ edad: { $gt: 25 } })

// Encontrar un solo documento
db.usuarios.findOne({ email: "juan@ejemplo.com" })
```

**Update (Actualizar):**
```javascript
// Actualizar un documento
db.usuarios.updateOne(
  { email: "juan@ejemplo.com" },
  { $set: { edad: 31 } }
)

// Actualizar múltiples documentos
db.usuarios.updateMany(
  { edad: { $lt: 30 } },
  { $inc: { puntos: 10 } }
)

// Reemplazar un documento
db.usuarios.replaceOne(
  { email: "juan@ejemplo.com" },
  { nombre: "Juan Pérez", email: "juan.nuevo@ejemplo.com" }
)
```

**Delete (Eliminar):**
```javascript
// Eliminar un documento
db.usuarios.deleteOne({ email: "juan@ejemplo.com" })

// Eliminar múltiples documentos
db.usuarios.deleteMany({ edad: { $gt: 60 } })
```

#### Operadores de Consulta

**Operadores de Comparación:**
- `$eq` - Igual a
- `$ne` - No igual a
- `$gt` - Mayor que
- `$gte` - Mayor o igual que
- `$lt` - Menor que
- `$lte` - Menor o igual que
- `$in` - En un array
- `$nin` - No en un array

**Operadores Lógicos:**
- `$and` - Y lógico
- `$or` - O lógico
- `$not` - Negación
- `$nor` - Ni lógico

**Operadores de Array:**
- `$all` - Todos los elementos en el array
- `$elemMatch` - Al menos un elemento coincide
- `$size` - Tamaño del array

**Ejemplos:**
```javascript
// Usando múltiples condiciones
db.usuarios.find({
  $and: [
    { edad: { $gt: 20 } },
    { edad: { $lt: 30 } },
    { ciudad: "Ciudad de México" }
  ]
})

// Buscar en arrays
db.usuarios.find({
  intereses: { $in: ["música", "deportes"] }
})
```

#### Proyecciones

```javascript
// Incluir solo ciertos campos
db.usuarios.find(
  { edad: { $gt: 25 } },
  { nombre: 1, email: 1, _id: 0 }
)

// Excluir campos
db.usuarios.find(
  {},
  { password: 0, token: 0 }
)
```

#### Ordenamiento y Límites

```javascript
// Ordenar por edad descendente
db.usuarios.find().sort({ edad: -1 })

// Limitar resultados
db.usuarios.find().limit(10)

// Paginación
db.usuarios.find()
  .sort({ fecha_registro: -1 })
  .skip(20)
  .limit(10)
```

#### Agregaciones Básicas

```javascript
// Contar documentos
db.usuarios.countDocuments({ edad: { $gt: 25 } })

// Agrupar por ciudad y contar
db.usuarios.aggregate([
  { $group: { _id: "$ciudad", total: { $sum: 1 } } },
  { $sort: { total: -1 } }
])

// Promedio de edad por ciudad
db.usuarios.aggregate([
  { $group: { _id: "$ciudad", promedioEdad: { $avg: "$edad" } } }
])
```

#### Operadores de Expresión

- `$sum` - Suma
- `$avg` - Promedio
- `$min` - Valor mínimo
- `$max` - Valor máximo
- `$push` - Agregar a un array
- `$addToSet` - Agregar a un array (sin duplicados)

**Ejemplo avanzado:**
```javascript
db.ventas.aggregate([
  // Filtro inicial
  { $match: { fecha: { $gte: new Date("2023-01-01") } } },
  
  // Descomponer array de productos
  { $unwind: "$productos" },
  
  // Agrupar por producto
  { $group: {
    _id: "$productos.id",
    nombre: { $first: "$productos.nombre" },
    cantidadVendida: { $sum: "$productos.cantidad" },
    ingresos: { $sum: { $multiply: ["$productos.precio", "$productos.cantidad"] } }
  }},
  
  // Ordenar por ingresos descendente
  { $sort: { ingresos: -1 } },
  
  // Limitar a los 10 primeros
  { $limit: 10 }
])
```

### 4. Diseño de Esquemas y Relaciones

El diseño de esquemas en MongoDB es fundamental para el rendimiento y escalabilidad de las aplicaciones. A diferencia de las bases de datos relacionales, MongoDB ofrece flexibilidad en el modelado de datos.

#### Modelado de Datos en MongoDB

**Características clave:**
- **Esquema flexible**: Los documentos en una colección pueden tener diferentes campos.
- **Documentos anidados**: Permite estructuras jerárquicas complejas.
- **Referencias entre documentos**: Para relaciones entre colecciones.

**Ejemplo de modelo de datos:**
```javascript
// Modelo para un blog
{
  _id: ObjectId("5f8d04b3b54764421b7156c3"),
  titulo: "Introducción a MongoDB",
  contenido: "...",
  autor: {
    nombre: "Ana López",
    email: "ana@ejemplo.com"
  },
  etiquetas: ["mongodb", "bases de datos", "nosql"],
  comentarios: [
    {
      usuario: "usuario123",
      texto: "Excelente artículo",
      fecha: ISODate("2023-10-15T14:30:00Z")
    }
  ],
  fecha_publicacion: ISODate("2023-10-10T09:00:00Z"),
  visitas: 150,
  estado: "publicado"
}
```

#### Referencias vs Documentos Embebidos

**Documentos Embebidos (Embedded Documents):**
- **Ventajas:**
  - Mejor rendimiento para lecturas frecuentes
  - Consultas atómicas en un solo documento
  - Ideal para relaciones "tiene un" o "tiene pocos"
- **Ejemplo:**
  ```javascript
  // Documento de pedido con productos embebidos
  {
    _id: 1001,
    cliente: "Juan Pérez",
    fecha: ISODate("2023-10-15"),
    productos: [
      { id: 1, nombre: "Laptop", precio: 1200, cantidad: 1 },
      { id: 2, nombre: "Mouse", precio: 25, cantidad: 2 }
    ],
    total: 1250
  }
  ```

**Referencias (References):**
- **Ventajas:**
  - Mejor para relaciones "muchos a muchos"
  - Evita duplicación de datos
  - Mejor para documentos grandes o que cambian frecuentemente
- **Ejemplo:**
  ```javascript
  // Colección de pedidos
  {
    _id: 1001,
    cliente: ObjectId("5f8d04b3b54764421b7156c3"),
    fecha: ISODate("2023-10-15"),
    productos: [
      ObjectId("5f8d04b3b54764421b7156d1"),
      ObjectId("5f8d04b3b54764421b7156d2")
    ],
    total: 1250
  }
  
  // Colección de productos (referenciada)
  {
    _id: ObjectId("5f8d04b3b54764421b7156d1"),
    nombre: "Laptop",
    precio: 1200,
    categoria: "Tecnología"
  }
  ```

#### Patrones de Diseño Comunes

1. **Patrón de Subconjunto (Subset Pattern):**
   - Almacena solo los datos más usados en un documento y el resto en colecciones separadas.
   - **Ejemplo:** Almacenar solo los 5 comentarios más recientes en un post de blog.

2. **Patrón de Atributos de Variación (Attribute Pattern):**
   - Útil cuando los atributos varían significativamente entre documentos.
   - **Ejemplo:** Productos con diferentes características por categoría.

3. **Patrón de Bucket:**
   - Agrupa datos en "cubos" o "contenedores" para optimizar consultas de series de tiempo.
   - **Ejemplo:** Lecturas de sensores agrupadas por hora.

4. **Patrón de Árbol (Tree Pattern):**
   - Para representar jerarquías o estructuras de árbol.
   - **Ejemplo:** Comentarios con respuestas anidadas.

5. **Patrón de Propiedades (Property Pattern):**
   - Para documentos con muchos campos opcionales.
   - **Ejemplo:**
     ```javascript
     {
       _id: 1,
       propiedades: [
         { clave: "color", valor: "rojo" },
         { clave: "talla", valor: "M" },
         { clave: "material", valor: "algodón" }
       ]
     }
     ```

#### Consideraciones de Rendimiento

1. **Índices:**
   - Crea índices en campos de consulta frecuentes.
   - Usa índices compuestos para consultas que filtran por múltiples campos.
   - Considera índices parciales para consultas comunes sobre subconjuntos de datos.

2. **Tamaño de Documento:**
   - MongoDB tiene un límite de 16MB por documento.
   - Documentos más pequeños generalmente ofrecen mejor rendimiento.

3. **Operaciones de Escritura vs Lectura:**
   - Optimiza para el patrón de acceso más común (lectura o escritura).
   - Considera la consistencia eventual para aplicaciones que pueden tolerar cierta latencia.

4. **Sharding:**
   - Distribuye datos en múltiples servidores para escalar horizontalmente.
   - Elige una clave de partición (shard key) que distribuya uniformemente las operaciones.

#### Normalización vs Desnormalización

**Normalización (Referencias):**
```javascript
// Colección de usuarios
{
  _id: ObjectId("5f8d04b3b54764421b7156c3"),
  nombre: "Ana López",
  email: "ana@ejemplo.com"
}

// Colección de direcciones (referenciada)
{
  _id: ObjectId("5f8d04b3b54764421b7156d4"),
  usuario_id: ObjectId("5f8d04b3b54764421b7156c3"),
  calle: "Av. Principal 123",
  ciudad: "Ciudad de México",
  pais: "México"
}
```

**Desnormalización (Documentos embebidos):**
```javascript
{
  _id: ObjectId("5f8d04b3b54764421b7156c3"),
  nombre: "Ana López",
  email: "ana@ejemplo.com",
  direccion: {
    calle: "Av. Principal 123",
    ciudad: "Ciudad de México",
    pais: "México"
  }
}
```

**Cuándo normalizar (usar referencias):**
- Cuando los datos se actualizan con frecuencia.
- Cuando los datos se comparten entre muchos documentos.
- Cuando los documentos individuales superarían el límite de 16MB.

**Cuándo desnormalizar (usar documentos embebidos):**
- Cuando los datos se leen juntos frecuentemente.
- Cuando los datos rara vez cambian.
- Para mejorar el rendimiento de lectura.

#### Ejemplo de Diseño Completo: Sistema de Blog

```javascript
// Colección de usuarios
{
  _id: ObjectId("5f8d04b3b54764421b7156c3"),
  username: "analopez",
  nombre: "Ana López",
  email: "ana@ejemplo.com",
  fecha_registro: ISODate("2023-01-15"),
  rol: "autor",
  bio: "Escritora de tecnología y viajes",
  redes_sociales: {
    twitter: "@analopez",
    github: "analopez"
  }
}

// Colección de posts
{
  _id: ObjectId("5f8d04b3b54764421b7156d5"),
  titulo: "Guía completa de MongoDB",
  slug: "guia-completa-mongodb",
  contenido: "...",
  autor: {
    id: ObjectId("5f8d04b3b54764421b7156c3"),
    nombre: "Ana López",
    username: "analopez"
  },
  etiquetas: ["mongodb", "bases de datos", "nosql"],
  categorias: ["Tecnología", "Programación"],
  fecha_publicacion: ISODate("2023-10-10T09:00:00Z"),
  fecha_actualizacion: ISODate("2023-10-12T11:30:00Z"),
  estado: "publicado",
  visitas: 1500,
  likes: 42,
  comentarios: [
    {
      id: ObjectId("5f8d04b3b54764421b7156d6"),
      usuario: {
        id: ObjectId("5f8d04b3b54764421b7156c4"),
        nombre: "Carlos Ruiz",
        username: "cruiz"
      },
      texto: "Excelente artículo, muy completo.",
      fecha: ISODate("2023-10-10T14:30:00Z"),
      respuestas: [
        {
          id: ObjectId("5f8d04b3b54764421b7156d7"),
          usuario: {
            id: ObjectId("5f8d04b3b54764421b7156c3"),
            nombre: "Ana López",
            username: "analopez"
          },
          texto: "¡Gracias Carlos!",
          fecha: ISODate("2023-10-10T15:15:00Z")
        }
      ]
    }
  ],
  metadatos: {
    tiempo_lectura: 12, // minutos
    palabras: 2500,
    idioma: "es"
  }
}
```

#### Mejores Prácticas de Diseño

1. **Conoce tus consultas:**
   - Diseña tu esquema basado en los patrones de consulta de tu aplicación.
   - Evita consultas que requieran múltiples joins (uniones).

2. **Preferencia por la desnormalización:**
   - En MongoDB, es mejor duplicar datos que hacer múltiples consultas.
   - Mantén juntos los datos que se leen juntos.

3. **Considera el crecimiento de documentos:**
   - Evita arrays que puedan crecer sin límite.
   - Usa referencias para relaciones uno a muchos o muchos a muchos.

4. **Usa índices estratégicamente:**
   - Crea índices para consultas frecuentes.
   - Monitorea el rendimiento de las consultas.

5. **Plan para la escalabilidad:**
   - Considera el sharding para colecciones grandes.
   - Elige claves de partición que distribuyan la carga uniformemente.

#### Herramientas de Monitoreo y Optimización

1. **MongoDB Compass:**
   - Interfaz gráfica para analizar consultas.
   - Plan de ejecución de consultas.

2. **MongoDB Atlas:**
   - Monitoreo en tiempo real.
   - Alertas de rendimiento.

3. **Comandos útiles:**
   ```javascript
   // Explicar plan de ejecución
   db.collection.find(query).explain("executionStats")
   
   // Ver índices
   db.collection.getIndexes()
   
   // Estadísticas de colección
   db.collection.stats()
   ```

## Recursos Adicionales
- [Documentación oficial de MongoDB](https://www.mongodb.com/docs/)
- [MongoDB University (Cursos gratuitos)](https://university.mongodb.com/)
- [MongoDB Community Forums](https://community.mongodb.com/)
