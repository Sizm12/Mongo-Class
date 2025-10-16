# Modelo de Base de Datos Documental

## 1. Modelo Documental

El modelo de base de datos documental es un tipo de base de datos NoSQL que almacena datos en documentos similares a JSON (u otros formatos como BSON, XML, etc.). A diferencia de las bases de datos relacionales, no requiere un esquema fijo y permite estructuras anidadas.

**Características principales:**
- Almacenamiento en documentos semiestructurados
- Sin esquema fijo (schema-less)
- Tipos de datos flexibles
- Soporte para estructuras anidadas
- Metadatos incorporados

## 2. Estructura de una Base de Datos Documental

### 2.1. Jerarquía de la Estructura

Una base de datos documental se organiza en una jerarquía de componentes:

```
Base de Datos (Database)
  └── Colecciones (Collections)
        └── Documentos (Documents)
              └── Campos (Fields)
```

### 2.2. Componentes Principales

#### Base de Datos (Database)
- Contenedor lógico de colecciones
- Puede contener múltiples colecciones
- Generalmente se asocia a una aplicación o servicio específico

#### Colecciones (Collections)
- Agrupación lógica de documentos
- Equivalente a tablas en bases relacionales, pero sin esquema fijo
- Pueden contener documentos con estructuras diferentes
- Se pueden crear índices para optimizar búsquedas

#### Documentos (Documents)
- Unidad básica de almacenamiento
- Normalmente en formato JSON/BSON
- Cada documento debe tener un identificador único (`_id`)
- Pueden contener estructuras anidadas y arrays

#### Campos (Fields)
- Pares clave-valor dentro de un documento
- Tipos de datos flexibles (string, number, boolean, array, objeto, etc.)
- No requieren ser definidos previamente
- Pueden variar entre documentos de la misma colección

### 2.3. Características de los Documentos

**Identificadores Únicos**
- Cada documento tiene un campo `_id` único
- Generalmente es generado automáticamente
- Puede ser de cualquier tipo, pero normalmente es un ObjectId

**Esquema Dinámico**
- No hay un esquema fijo que defina la estructura
- Los documentos en la misma colección pueden tener diferentes campos
- Los campos pueden ser añadidos o eliminados sin afectar a otros documentos

**Tipos de Datos**
- Tipos escalares: string, number, boolean, null
- Tipos compuestos: array, objeto anidado
- Tipos especiales: fecha, binario, expresión regular
- Referencias a otros documentos

### 2.4. Modelado de Datos

**Documentos Anidados**
- Permiten representar relaciones uno-a-uno
- Mejoran el rendimiento al mantener juntos los datos relacionados
- Ejemplo: dirección dentro de un documento de usuario

**Referencias**
- Para relaciones uno-a-muchos o muchos-a-muchos
- Se guarda el `_id` de otro documento
- Requiere consultas adicionales para recuperar la información relacionada

**Arrays**
- Permiten almacenar múltiples valores
- Pueden contener tipos de datos mixtos
- Útiles para relaciones uno-a-muchos dentro del mismo documento

### 2.5. Ejemplo de Documento con Estructura Completa

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "informacionPersonal": {
    "nombre": "Juan Pérez",
    "fechaNacimiento": ISODate("1990-05-15"),
    "documento": {
      "tipo": "DNI",
      "numero": "30123456"
    }
  },
  "contacto": {
    "email": "juan@ejemplo.com",
    "telefonos": [
      {"tipo": "móvil", "numero": "+5491123456789"},
      {"tipo": "fijo", "numero": "011-4321-9876"}
    ]
  },
  "direcciones": [
    {
      "tipo": "casa",
      "calle": "Calle Falsa",
      "numero": 123,
      "piso": "2B",
      "ciudad": "Buenos Aires",
      "pais": "Argentina",
      "codigoPostal": "C1234ABC",
      "esPrincipal": true
    }
  ],
  "preferencias": {
    "notificaciones": {
      "email": true,
      "sms": false,
      "push": true
    },
    "tema": "oscuro",
    "idioma": "es-AR"
  },
  "estadisticas": {
    "ultimoAcceso": ISODate("2023-10-16T10:30:00Z"),
    "visitasTotales": 42,
    "activo": true
  },
  "fechaCreacion": ISODate("2023-01-01T00:00:00Z"),
  "fechaActualizacion": ISODate("2023-10-16T10:30:00Z")
}
```

### 2.6. Consideraciones de Diseño

**Ventajas del Modelo Documental**
- Esquema flexible que se adapta a cambios
- Rendimiento mejorado para operaciones de lectura
- Modelo natural para datos jerárquicos
- Fácil integración con lenguajes de programación modernos

**Desafíos**
- Falta de normalización puede llevar a duplicación de datos
- Consultas complejas pueden ser más difíciles de optimizar
- Transacciones atómicas limitadas (aunque mejoradas en versiones recientes)

### 2.7. Buenas Prácticas

- Usar documentos anidados para datos que se acceden juntos frecuentemente
- Mantener los documentos de un tamaño razonable (generalmente < 16MB)
- Usar referencias para relaciones que crecen sin límite
- Considerar el patrón de acceso a los datos al diseñar la estructura
- Crear índices para campos de consulta frecuentes
- Implementar versionado de esquema para manejar cambios en la estructura


## 3. Lenguajes de Consulta

### 3.1. Lenguajes específicos:
- **MongoDB Query Language (MQL)**: Usado por MongoDB
- **CouchDB Query Language (Mango)**: Usado por CouchDB
- **N1QL (SQL for JSON)**: Usado por Couchbase

### 3.2. Operaciones básicas:
- **CRUD** (Create, Read, Update, Delete)
- **Agregaciones**
- **Índices**
- **Transacciones** (en algunas implementaciones)

## 4. Ejemplos de Uso en Sistemas

### 4.1. Casos de uso comunes:
- **Sistemas de gestión de contenidos (CMS)**
- **Catálogos de productos**
- **Aplicaciones móviles**
- **Almacenamiento de perfiles de usuario**
- **Sistemas de registro de eventos**
- **Aplicaciones en tiempo real**

### 4.2. Ejemplo de caso de uso:
```javascript
// Insertar un nuevo usuario
db.usuarios.insertOne({
  nombre: "Ana García",
  rol: "admin",
  ultimo_acceso: new Date(),
  preferencias: {
    tema: "oscuro",
    notificaciones: true
  }
});
```

## 5. Motores de Bases de Datos NoSQL Documental

### 5.1. Principales motores:

1. **MongoDB**
   - Más popular
   - Alto rendimiento
   - Escalabilidad horizontal
   - Comunidad activa

2. **CouchDB**
   - Replicación multi-maestro
   - Sincronización bidireccional
   - API RESTful nativa

3. **Couchbase**
   - Alto rendimiento
   - Compatible con SQL (N1QL)
   - Caché integrado

4. **Amazon DocumentDB**
   - Servicio administrado por AWS
   - Compatible con MongoDB
   - Escalabilidad automática

5. **RavenDB**
   - Base de datos .NET nativa
   - ACID Transactions
   - Consultas potentes

### 5.2. Criterios de selección:
- Volumen de datos
- Rendimiento requerido
- Consistencia vs disponibilidad
- Presupuesto
- Habilidades del equipo
- Integración con el ecosistema existente

## 6. Ventajas y Desventajas

### Ventajas:
- Flexibilidad en el esquema
- Buen rendimiento para lecturas
- Escalabilidad horizontal
- Modelado de datos intuitivo
- Fácil integración con lenguajes de programación modernos

### Desventajas:
- Menor consistencia que las bases relacionales
- Menor soporte para transacciones complejas
- Menor madurez en algunas herramientas
- Posible redundancia de datos

## 7. Conclusión

Las bases de datos documentales ofrecen una alternativa flexible y escalable a las bases de datos relacionales tradicionales, especialmente adecuadas para aplicaciones que manejan datos semiestructurados o que requieren un esquema dinámico. La elección del motor adecuado dependerá de los requisitos específicos del proyecto, el volumen de datos esperado y las capacidades del equipo de desarrollo.
