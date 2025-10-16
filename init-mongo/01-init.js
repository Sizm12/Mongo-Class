/**
 * GUÍA DIDÁCTICA DE MONGODB
 * 
 * Este script es tanto un ejemplo funcional como una guía de aprendizaje.
 * Cada sección está numerada para seguir el orden de aprendizaje.
 * 
 * Para ejecutar este script manualmente en el contenedor:
 * docker exec -it mongodb mongosh -u admin -p admin123 --authenticationDatabase admin /docker-entrypoint-initdb.d/01-init.js
 */

// ===== 1. CONEXIÓN Y SELECCIÓN DE BASE DE DATOS =====
print('=== 1. Conectando a MongoDB y seleccionando base de datos ===');

// Crear/Seleccionar una base de datos
const dbName = 'aprendizaje_mongodb';
const db = db.getSiblingDB(dbName);
print(`✅ Base de datos '${dbName}' seleccionada`);

// ===== 2. CREACIÓN DE COLECCIONES =====
print('\n=== 2. Creando colecciones ===');

// Crear una colección de usuarios
const usuariosCollection = 'usuarios';
db.createCollection(usuariosCollection);
print(`✅ Colección '${usuariosCollection}' creada`);

// Crear una colección de productos
const productosCollection = 'productos';
db.createCollection(productosCollection);
print(`✅ Colección '${productosCollection}' creada`);

// ===== 3. INSERCIÓN DE DOCUMENTOS =====
print('\n=== 3. Insertando documentos de ejemplo ===');

// Insertar múltiples usuarios
const resultadoUsuarios = db[usuariosCollection].insertMany([
  {
    nombre: 'Ana García',
    email: 'ana@ejemplo.com',
    edad: 28,
    direccion: {
      calle: 'Av. Principal 123',
      ciudad: 'Ciudad de México',
      pais: 'México'
    },
    intereses: ['programación', 'música', 'viajes'],
    activo: true,
    fecha_registro: new Date(),
    ultimo_acceso: new Date()
  },
  {
    nombre: 'Carlos López',
    email: 'carlos@ejemplo.com',
    edad: 35,
    direccion: {
      calle: 'Calle Secundaria 456',
      ciudad: 'Guadalajara',
      pais: 'México'
    },
    intereses: ['deportes', 'tecnología'],
    activo: true,
    fecha_registro: new Date(),
    ultimo_acceso: new Date()
  }
]);
print(`✅ ${resultadoUsuarios.insertedCount} usuarios insertados`);

// Insertar múltiples productos
const resultadoProductos = db[productosCollection].insertMany([
  {
    nombre: 'Laptop Gamer',
    precio: 25000.00,
    categoria: 'Tecnología',
    especificaciones: {
      procesador: 'Intel i7',
      ram: '16GB',
      almacenamiento: '1TB SSD'
    },
    stock: 15,
    en_oferta: true,
    etiquetas: ['gaming', 'tecnología', 'portátil']
  },
  {
    nombre: 'Smartphone',
    precio: 12000.00,
    categoria: 'Tecnología',
    especificaciones: {
      pantalla: '6.5 pulgadas',
      almacenamiento: '128GB',
      camara: '48MP'
    },
    stock: 30,
    en_oferta: false,
    etiquetas: ['móvil', 'smartphone', 'tecnología']
  }
]);
print(`✅ ${resultadoProductos.insertedCount} productos insertados`);

// ===== 4. CREACIÓN DE ÍNDICES =====
print('\n=== 4. Creando índices para optimizar búsquedas ===');

// Índice único para email en la colección de usuarios
db[usuariosCollection].createIndex({ email: 1 }, { unique: true, name: 'idx_email_unico' });
print('✅ Índice único creado en el campo email de usuarios');

// Índice compuesto para búsquedas por ciudad y país
db[usuariosCollection].createIndex(
  { 'direccion.ciudad': 1, 'direccion.pais': 1 },
  { name: 'idx_ubicacion' }
);
print('✅ Índice compuesto creado para ubicación de usuarios');

// Índice de texto para búsqueda de texto completo
db[productosCollection].createIndex(
  { nombre: 'text', descripcion: 'text' },
  { name: 'idx_busqueda_texto', default_language: 'spanish' }
);
print('✅ Índice de texto creado para búsquedas en productos');

// ===== 5. CONSULTAS DE EJEMPLO =====
print('\n=== 5. Ejemplos de consultas ===');

// Contar documentos en una colección
const totalUsuarios = db[usuariosCollection].countDocuments();
print(`📊 Total de usuarios en la base de datos: ${totalUsuarios}`);

// Encontrar todos los usuarios activos
const usuariosActivos = db[usuariosCollection].find({ activo: true }).count();
print(`👥 Usuarios activos: ${usuariosActivos}`);

// Encontrar productos con precio mayor a 10000
const productosCaros = db[productosCollection].find({ precio: { $gt: 10000 } }).count();
print(`💎 Productos con precio mayor a $10,000: ${productosCaros}`);

// ===== 6. USUARIOS Y PERMISOS =====
print('\n=== 6. Configurando usuarios y permisos ===');

// Crear un usuario de solo lectura
const usuarioReadOnly = 'usuario_consulta';
db.getSiblingDB('admin').createUser({
  user: usuarioReadOnly,
  pwd: 'consulta123',
  roles: [
    { role: 'read', db: dbName }
  ]
});
print(`🔐 Usuario '${usuarioReadOnly}' creado con permisos de solo lectura`);

// Crear un usuario con permisos de lectura y escritura
const usuarioApp = 'aplicacion_web';
db.getSiblingDB('admin').createUser({
  user: usuarioApp,
  pwd: 'app_segura_123',
  roles: [
    { role: 'readWrite', db: dbName },
    { role: 'read', db: 'admin' }
  ]
});
print(`🔑 Usuario '${usuarioApp}' creado con permisos de lectura/escritura`);

// ===== 7. INFORMACIÓN DEL SISTEMA =====
print('\n=== 7. Información del sistema ===');

// Mostrar bases de datos disponibles
const dbs = db.adminCommand('listDatabases');
print('📚 Bases de datos disponibles:');
dbs.databases.forEach(dbInfo => {
  print(`   - ${dbInfo.name} (${(dbInfo.sizeOnDisk / (1024*1024)).toFixed(2)} MB)`);
});

// Mostrar colecciones en la base de datos actual
const collections = db.getCollectionNames();
print('\n📂 Colecciones en la base de datos actual:');
collections.forEach(collection => {
  const count = db[collection].countDocuments();
  print(`   - ${collection}: ${count} documentos`);
});

// ===== FIN DE LA GUÍA =====
print('\n🎉 ¡Guía de MongoDB completada exitosamente! 🎉');
print('Puedes comenzar a ejecutar tus propias consultas.');
print('Prueba algunos comandos como:');
print('  - db.usuarios.find()');
print('  - db.productos.find({ precio: { $gt: 10000 } })');
print('  - db.usuarios.aggregate([{ $group: { _id: "$direccion.ciudad", total: { $sum: 1 } } }])');

// Retornar mensaje de éxito para propósitos de script
'Guía de MongoDB ejecutada exitosamente';
