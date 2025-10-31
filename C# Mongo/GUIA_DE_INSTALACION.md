# Guía de Instalación, Configuración y Construcción

Esta guía te ayudará a configurar, construir y ejecutar el proyecto localmente siguiendo los principios de Domain-Driven Design (DDD).

Esta guía te ayudará a configurar y ejecutar el proyecto localmente.

## Estructura del Proyecto

El proyecto sigue una arquitectura limpia (Clean Architecture) con separación clara de responsabilidades:

```
src/
├── DDDExample.API/               # Capa de presentación (Web API)
│   ├── Controllers/             # Controladores de la API
│   ├── DependencyInjection.cs   # Configuración de inyección de dependencias
│   └── Program.cs               # Punto de entrada de la aplicación
├── DDDExample.Application/       # Capa de aplicación
│   ├── DTOs/                    # Objetos de transferencia de datos
│   ├── Interfaces/              # Interfaces de servicios
│   ├── Mappings/                # Configuración de AutoMapper
│   └── Services/                # Implementación de servicios
├── DDDExample.Domain/           # Capa de dominio
│   ├── Entities/                # Entidades del dominio
│   ├── Repositories/            # Interfaces de repositorios
│   └── Common/                  # Clases base y utilidades
└── DDDExample.Infrastructure/   # Capa de infraestructura
    ├── Persistence/            # Configuración de MongoDB
    └── Repositories/           # Implementación de repositorios
```

## Configuración por Capas

### 1. Configuración de la Capa de Dominio

#### 1.1 Entidades
- Ubicación: `DDDExample.Domain/Entities/`
- Configuración:
  ```csharp
  // Ejemplo: Product.cs
  public class Product : Entity
  {
      public string Name { get; private set; }
      public string Description { get; private set; }
      public decimal Price { get; private set; }
      public int Stock { get; private set; }
      
      // Constructor y métodos de negocio
  }
  ```

#### 1.2 Interfaces de Repositorio
- Ubicación: `DDDExample.Domain/Repositories/`
- Configuración:
  ```csharp
  public interface IProductRepository : IRepository<Product>
  {
      Task<IEnumerable<Product>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice);
      Task<IEnumerable<Product>> GetProductsInStockAsync();
  }
  ```

### 2. Configuración de la Capa de Aplicación

#### 2.1 DTOs (Data Transfer Objects)
- Ubicación: `DDDExample.Application/DTOs/`
- Configuración:
  ```csharp
  public class ProductDto
  {
      public Guid Id { get; set; }
      public string Name { get; set; }
      public string Description { get; set; }
      public decimal Price { get; set; }
      public int Stock { get; set; }
  }
  ```

#### 2.2 Mapeos con AutoMapper
- Ubicación: `DDDExample.Application/Mappings/`
- Configuración:
  ```csharp
  public class MappingProfile : Profile
  {
      public MappingProfile()
      {
          CreateMap<Product, ProductDto>();
          // Configuraciones de mapeo adicionales
      }
  }
  ```

#### 2.3 Servicios de Aplicación
- Ubicación: `DDDExample.Application/Services/`
- Configuración:
  ```csharp
  public class ProductService : IProductService
  {
      private readonly IProductRepository _productRepository;
      private readonly IMapper _mapper;
      
      public ProductService(IProductRepository productRepository, IMapper mapper)
      {
          _productRepository = productRepository;
          _mapper = mapper;
      }
      // Implementación de métodos
  }
  ```

### 3. Configuración de la Capa de Infraestructura

#### 3.1 Configuración de MongoDB
- Ubicación: `DDDExample.Infrastructure/Persistence/`
- Configuración en `appsettings.json`:
  ```json
  {
    "MongoDB": {
      "ConnectionString": "mongodb+srv://<username>:<password>@<cluster-address>/test?retryWrites=true&w=majority",
      "DatabaseName": "DDDExampleDB"
    }
  }
  ```

#### 3.2 Implementación de Repositorios

La implementación del repositorio maneja la persistencia de datos con MongoDB. Aquí está la configuración detallada:

```csharp
public class ProductRepository : IProductRepository
{
    private readonly IMongoCollection<Product> _collection;
    
    // Inyección de dependencia del cliente de MongoDB
    public ProductRepository(IMongoDatabase database)
    {
        // Nombre de la colección en MongoDB
        _collection = database.GetCollection<Product>("Products");
        
        // Crear índices si es necesario
        CreateIndexes();
    }
    
    private void CreateIndexes()
    {
        // Crear índice en el campo Name para búsquedas eficientes
        var indexKeys = Builders<Product>.IndexKeys.Ascending(p => p.Name);
        var indexOptions = new CreateIndexOptions { Unique = false };
        _collection.Indexes.CreateOne(new CreateIndexModel<Product>(indexKeys, indexOptions));
    }
    
    // Implementación de métodos de la interfaz...
}
```

#### 3.3 Configuración del Contexto de MongoDB

La clase `MongoDBContext` es fundamental para la conexión con la base de datos:

```csharp
public class MongoDBContext<T> where T : Entity
{
    private readonly IMongoCollection<T> _collection;

    public MongoDBContext(IMongoDatabase database, string collectionName)
    {
        // Validar parámetros
        if (database == null) 
            throw new ArgumentNullException(nameof(database));
            
        if (string.IsNullOrWhiteSpace(collectionName))
            throw new ArgumentException("El nombre de la colección no puede estar vacío", nameof(collectionName));

        _collection = database.GetCollection<T>(collectionName);
    }
    
    // Métodos del repositorio...
}
```

#### 3.4 Configuración de la Conexión

La configuración de la conexión se maneja en `DependencyInjection.cs`:

```csharp
// Configuración del cliente MongoDB
services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var settings = configuration.GetSection("MongoDB").Get<MongoDBSettings>();
    
    // Configuración del cliente con opciones recomendadas
    var mongoClientSettings = MongoClientSettings.FromUrl(
        new MongoUrl(settings.ConnectionString));
        
    // Configuración de opciones del cliente
    mongoClientSettings.ServerApi = new ServerApi(ServerApiVersion.V1);
    mongoClientSettings.ClusterConfigurator = cb => {
        // Habilitar logging de consultas (solo en desarrollo)
        if (environment.IsDevelopment())
        {
            cb.Subscribe<CommandSucceededEvent>(e =>
            {
                Console.WriteLine($"MongoDB Command: {e.CommandName} - {e.Duration}");
            });
        }
    };
    
    return new MongoClient(mongoClientSettings);
});

// Configuración de la base de datos
services.AddScoped<IMongoDatabase>(serviceProvider =>
{
    var client = serviceProvider.GetRequiredService<IMongoClient>();
    var settings = serviceProvider.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    return client.GetDatabase(settings.DatabaseName);
});
```

#### 3.5 Registro de Servicios

En `DependencyInjection.cs`, se registran los servicios necesarios:

```csharp
// Registrar configuración de MongoDB
services.Configure<MongoDBSettings>(
    configuration.GetSection("MongoDB"));

// Registrar AutoMapper con perfiles de la capa de aplicación
services.AddAutoMapper(typeof(Application.Mappings.MappingProfile));

// Registrar servicios de aplicación
services.AddScoped<IProductService, ProductService>();

// Registrar repositorios
services.AddScoped<IProductRepository, ProductRepository>();

// Registrar el contexto de MongoDB para cada entidad
services.AddScoped<MongoDBContext<Product>>(provider => 
    new MongoDBContext<Product>(
        provider.GetRequiredService<IMongoDatabase>(), 
        "Products"));
```

### 4. Configuración de la Capa de API

#### 4.1 Configuración de Inyección de Dependencias
- Ubicación: `DDDExample.Infrastructure/Repositories/`
- Configuración:
  ```csharp
  public class ProductRepository : IProductRepository
  {
      private readonly IMongoCollection<Product> _collection;
      
      public ProductRepository(IMongoDatabase database)
      {
          _collection = database.GetCollection<Product>("Products");
      }
      // Implementación de métodos
  }
  ```

### 4. Configuración de la Capa de API

#### 4.1 Configuración de Inyección de Dependencias
- Ubicación: `DDDExample.API/DependencyInjection.cs`
- Configuración:
  ```csharp
  public static IServiceCollection AddInfrastructure(
      this IServiceCollection services, 
      IConfiguration configuration)
  {
      // Configuración de MongoDB
      services.Configure<MongoDBSettings>(
          configuration.GetSection("MongoDB"));
      
      // Configuración de AutoMapper
      services.AddAutoMapper(typeof(MappingProfile));
      
      // Registro de servicios
      services.AddScoped<IProductService, ProductService>();
      services.AddScoped<IProductRepository, ProductRepository>();
      
      return services;
  }
  ```

#### 4.2 Configuración de Swagger
- Ubicación: `DDDExample.API/Program.cs`
- Configuración:
  ```csharp
  builder.Services.AddSwaggerGen(c =>
  {
      c.SwaggerDoc("v1", new OpenApiInfo { 
          Title = "DDDExample.API", 
          Version = "v1" 
      });
  });
  ```

## Flujo de la Aplicación

1. **Capa de API**: Recibe las peticiones HTTP a través de los controladores
2. **Capa de Aplicación**: Orquesta el flujo de la aplicación usando servicios
3. **Capa de Dominio**: Contiene la lógica de negocio y reglas del dominio
4. **Capa de Infraestructura**: Maneja la persistencia de datos y servicios externos

## Requisitos Previos

- [.NET 6.0 SDK](https://dotnet.microsoft.com/download/dotnet/6.0) o superior
- [Visual Studio 2022](https://visualstudio.microsoft.com/es/vs/) o [Visual Studio Code](https://code.visualstudio.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cuenta gratuita)
- [Git](https://git-scm.com/) (opcional)

## Construcción de la Aplicación

### 1. Configuración de la Solución

La solución está organizada en 4 proyectos principales:

1. **DDDExample.API**: Proyecto web que expone los endpoints REST
2. **DDDExample.Application**: Contiene la lógica de la aplicación
3. **DDDExample.Domain**: Define el modelo de dominio y sus reglas
4. **DDDExample.Infrastructure**: Implementa la persistencia y servicios externos

### 2. Configuración de Dependencias

Las dependencias principales son:

- **API**:
  - `Microsoft.AspNetCore.OpenApi` para documentación de la API
  - `AutoMapper.Extensions.Microsoft.DependencyInjection` para mapeo de objetos
  - `MongoDB.Driver` para la conexión con MongoDB

- **Application**:
  - `AutoMapper` para mapeo entre entidades y DTOs

- **Infrastructure**:
  - `MongoDB.Driver` para operaciones con la base de datos
  - `Microsoft.Extensions.DependencyInjection.Abstractions` para inyección de dependencias

### 3. Configuración de MongoDB

La conexión a MongoDB se configura en `appsettings.json`:

```json
{
  "MongoDB": {
    "ConnectionString": "mongodb+srv://<username>:<password>@<cluster-address>/test?retryWrites=true&w=majority",
    "DatabaseName": "DDDExampleDB"
  }
}
```

### 4. Patrones y Buenas Prácticas

- **Repository Pattern**: Aislamos el acceso a datos mediante repositorios
- **Dependency Injection**: Todas las dependencias se inyectan en los constructores
- **DTOs**: Separación clara entre entidades de dominio y objetos de transferencia
- **Async/Await**: Operaciones asíncronas para mejor rendimiento
- **Inmutabilidad**: Las entidades de dominio son inmutables una vez creadas

### 5. Ejecutar la Aplicación

```bash
dotnet run
```

La aplicación estará disponible en:
- API: `https://localhost:5001` o `http://localhost:5000`
- Swagger UI: `https://localhost:5001/swagger` o `http://localhost:5000/swagger`

## Estructura de la Base de Datos

La aplicación creará automáticamente las colecciones necesarias en MongoDB. La colección principal es:
- `Products`: Almacena los productos del sistema

## Pruebas de la Aplicación

### Endpoints Disponibles

- `GET /api/products`: Obtener todos los productos
- `GET /api/products/{id}`: Obtener un producto por ID
- `POST /api/products`: Crear un nuevo producto
- `PUT /api/products/{id}`: Actualizar un producto existente
- `DELETE /api/products/{id}`: Eliminar un producto
- `GET /api/products/price-range?minPrice=X&maxPrice=Y`: Filtrar productos por rango de precios
- `GET /api/products/in-stock`: Obtener productos con stock disponible

### Ejemplo de Solicitudes

**Crear un producto:**
```http
POST /api/products
Content-Type: application/json

{
  "name": "Producto de Ejemplo",
  "description": "Descripción del producto",
  "price": 99.99,
  "stock": 10
}
```

**Obtener productos en stock:**
```http
GET /api/products/in-stock
```

## Solución de Problemas Comunes

### Error de conexión a MongoDB
- Verifica que la cadena de conexión sea correcta
- Asegúrate de que tu IP esté en la lista blanca de MongoDB Atlas
- Verifica que el usuario tenga los permisos necesarios

### Errores de migración
- Las migraciones son automáticas, pero si hay problemas, puedes borrar y recrear la base de datos

### Problemas con paquetes NuGet
- Ejecuta `dotnet restore` para restaurar los paquetes
- Asegúrate de tener la última versión del SDK de .NET
