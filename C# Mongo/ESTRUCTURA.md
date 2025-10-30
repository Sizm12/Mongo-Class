# Estructura del Proyecto DDD con MongoDB

Este documento describe la estructura del proyecto y la arquitectura utilizada.

## Arquitectura del Proyecto

El proyecto sigue una arquitectura basada en Domain-Driven Design (DDD) con las siguientes capas:

### 1. DDDExample.Domain

Contiene la lógica de negocio central y las entidades del dominio.

- **Entities/**: Contiene las entidades del dominio (ej: `Product.cs`)
- **Common/**: Clases base y utilidades compartidas (ej: `Entity.cs`)
- **Repositories/**: Interfaces de repositorio (ej: `IProductRepository.cs`)

### 2. DDDExample.Application

Contiene la lógica de la aplicación y casos de uso.

- **DTOs/**: Objetos de transferencia de datos
- **Interfaces/**: Interfaces de servicios de aplicación
- **Services/**: Implementación de servicios de aplicación
- **Mappings/**: Configuración de AutoMapper

### 3. DDDExample.Infrastructure

Implementa la persistencia y servicios de infraestructura.

- **Persistence/**: Configuración de MongoDB y contexto
- **Repositories/**: Implementaciones concretas de los repositorios

### 4. DDDExample.API

Capa de presentación que expone la API REST.

- **Controllers/**: Controladores de la API
- **DependencyInjection.cs**: Configuración de la inyección de dependencias
- **appsettings.json**: Configuración de la aplicación

## Flujo de Datos

1. **API Layer**: Recibe las peticiones HTTP
2. **Application Layer**: Maneja la lógica de negocio
3. **Domain Layer**: Contiene las reglas de negocio
4. **Infrastructure Layer**: Maneja la persistencia de datos

## Estructura de Carpetas

```
src/
├── DDDExample.API/
│   ├── Controllers/
│   ├── appsettings.json
│   ├── Program.cs
│   └── DependencyInjection.cs
├── DDDExample.Application/
│   ├── DTOs/
│   ├── Interfaces/
│   ├── Mappings/
│   └── Services/
├── DDDExample.Domain/
│   ├── Common/
│   ├── Entities/
│   └── Repositories/
└── DDDExample.Infrastructure/
    ├── Persistence/
    └── Repositories/
```

## Tecnologías Utilizadas

- .NET 6.0
- MongoDB.Driver 2.19.1
- AutoMapper 12.0.1
- Swashbuckle (Swagger) para documentación de API
- MongoDB Atlas como base de datos en la nube

## Convenciones de Código

- **Interfaces**: Prefijo 'I' (ej: `IProductService`)
- **DTOs**: Sufijo 'Dto' (ej: `ProductDto`)
- **Entidades**: Nombres en singular (ej: `Product`)
- **Repositorios**: Sufijo 'Repository' (ej: `ProductRepository`)
- **Métodos asíncronos**: Sufijo 'Async' (ej: `GetByIdAsync`)
