# Guía de Instalación y Configuración

Esta guía te ayudará a configurar y ejecutar el proyecto localmente.

## Requisitos Previos

- [.NET 6.0 SDK](https://dotnet.microsoft.com/download/dotnet/6.0) o superior
- [Visual Studio 2022](https://visualstudio.microsoft.com/es/vs/) o [Visual Studio Code](https://code.visualstudio.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cuenta gratuita)
- [Git](https://git-scm.com/) (opcional)

## Pasos para Configurar el Proyecto

### 1. Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd DDDExample
```

### 2. Configurar MongoDB Atlas

1. Inicia sesión en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuevo cluster (puedes usar el nivel gratuito)
3. Crea un usuario de base de datos con permisos de lectura/escritura
4. Añade tu dirección IP a la lista blanca
5. Obtén la cadena de conexión

### 2.1. Alternativa: MongoDB local con Docker

Si prefieres no usar Atlas, puedes levantar MongoDB localmente con Docker.

- Asegúrate de tener instalado Docker Desktop.
- Levanta un contenedor de MongoDB:

```bash
docker run -d \
  --name mongo-local \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  mongo:7-jammy
```

Opcionalmente, con docker-compose:

```yaml
version: "3.8"
services:
  mongo:
    image: mongo:7-jammy
    container_name: mongo-local
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:
```

Para iniciar en segundo plano:

```bash
docker compose up -d
```

Cadena de conexión para la aplicación (usa `authSource=admin` cuando defines usuario root):

```text
mongodb://root:example@localhost:27017/?authSource=admin
```

Luego continúa con la configuración de la aplicación en el siguiente paso usando esta cadena en lugar de la de Atlas.

### 3. Configurar la Aplicación

1. Abre el archivo `src/DDDExample.API/appsettings.json`
2. Actualiza la cadena de conexión con tus credenciales de MongoDB Atlas:

```json
{
  "MongoDB": {
    "ConnectionString": "mongodb+srv://<username>:<password>@<cluster-address>/test?retryWrites=true&w=majority",
    "DatabaseName": "DDDExampleDB"
  }
}
```

### 4. Restaurar Paquetes NuGet

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
cd src/DDDExample.API
dotnet restore
```

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

## Variables de Entorno (Opcional)

Puedes configurar las siguientes variables de entorno:

```bash
export MongoDB__ConnectionString="mongodb+srv://user:password@cluster.mongodb.net/"
export MongoDB__DatabaseName="DDDExampleDB"
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

## Despliegue

### Publicar la Aplicación

```bash
dotnet publish -c Release -o ./publish
```

### Docker (Opcional)

Puedes crear una imagen de Docker con el siguiente Dockerfile:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["DDDExample.API/DDDExample.API.csproj", "DDDExample.API/"]
RUN dotnet restore "DDDExample.API/DDDExample.API.csproj"
COPY . .
WORKDIR "/src/DDExample.API"
RUN dotnet build "DDDExample.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DDDExample.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DDDExample.API.dll"]
```

## Pruebas

Para ejecutar las pruebas unitarias (si las hay):

```bash
dotnet test
```

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
