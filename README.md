# 🎓 Sysacad App

## 👨‍💻 Desarrolladores
- **Branko Almeira**
- **Federico Sosa**
- **Agustin Giorlando**

---

## 📖 Descripción
**Sysacad App** es una plataforma académica robusta desarrollada en **Node.js** con una arquitectura orientada a servicios. El sistema principal gestiona usuarios, alumnos y profesores, mientras que funcionalidades específicas como la gestión de cargos y dedicaciones se manejan a través de microservicios contenerizados.

El proyecto destaca por su arquitectura **modular por capas**, uso de **Sequelize ORM**, base de datos **PostgreSQL**, y orquestación mediante **Docker** y **Traefik**.

---

## 📋 Requerimientos Funcionales

El sistema cumple con las siguientes funcionalidades clave:

1.  **Autenticación y Seguridad**:
    *   Login y Logout seguro mediante credenciales.
    *   Generación y validación de tokens JWT.
    *   Protección de rutas mediante middlewares de autorización.
    *   Manejo de roles (Admin, Profesor, Alumno).

2.  **Gestión de Usuarios**:
    *   Alta, Baja y Modificación de usuarios.
    *   Asignación de roles y permisos.

3.  **Gestión Académica**:
    *   **Alumnos**: Registro detallado con legajo, fecha de ingreso, cohorte y datos personales.
    *   **Profesores**: Registro con legajo, especialidad, antigüedad y datos personales.

4.  **Generación de Reportes**:
    *   Generación dinámica de analíticos en formato PDF para descarga.

5.  **Microservicios Auxiliares (Gestión)**:
    *   Administración centralizada de Cargos Docentes.
    *   Gestión de Categorías y Dedicaciones.

---

## 🏰 Arquitectura del Proyecto

El backend sigue una arquitectura limpia para asegurar mantenibilidad y escalabilidad:

```
src/
├── config/         # Configuración de entorno y base de datos
├── controllers/    # Controladores: manejan las peticiones HTTP
├── entities/       # Entidades de dominio
├── middlewares/    # Middlewares (Auth, Error Handling, Logging)
├── models/         # Modelos Sequelize (ORM)
├── repositories/   # Capa de acceso a datos
├── routes/         # Definición de endpoints
├── scripts/        # Scripts de utilidad (Seeders, Sync DB)
├── services/       # Lógica de negocio pura
└── tests/          # Tests unitarios e integración
```

---

## 🚀 Tecnologías

- **Backend Core**: Node.js, Express.js
- **Base de Datos**: PostgreSQL 15 (Docker)
- **ORM**: Sequelize
- **Autenticación**: JWT (Cookies httpOnly)
- **Infraestructura**: Docker, Docker Compose, Traefik (Reverse Proxy)
- **Testing**: Jest, Supertest
- **Microservicios**: Node.js Express Service independiente

---

## 🛠️ Instalación y Puesta en Marcha

Sigue estos pasos para levantar el entorno de desarrollo completo.

### 1. Requisitos Previos
- Node.js v18+
- Docker y Docker Compose instalados y corriendo.

### 2. Instalación de Dependencias
Instala las librerías necesarias en la raíz del proyecto:
```bash
npm install
```

### 3. Configuración de Entorno
Asegúrate de tener un archivo `.env` en la raíz con las siguientes variables (ajusta según tu entorno):

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=sysacad
DB_USER=postgres_user
DB_PASSWORD=postgres_user
JWT_SECRET=tu_clave_secreta_super_segura
NODE_ENV=development
```

### 4. Levantar Infraestructura (Docker)
El proyecto utiliza Docker Compose para levantar la base de datos PostgreSQL y los microservicios.

```bash
docker compose up -d
```
Esto iniciará:
- **Base de Datos**: Puerto `5433` (mapeado desde 5432).
- **Traefik**: Dashboard en `http://localhost:8080`.
- **Microservicio de Gestión**: Accesible vía Traefik.

### 5. Configuración de Base de Datos
Una vez levantado el contenedor de la DB, debes sincronizar las tablas e insertar datos iniciales.

**Paso A: Sincronizar Base de Datos**  
Este script crea o actualiza las tablas según los modelos definidos.
```bash
node src/scripts/sync-db.js
```
> *Nota: Usa `force: true` dentro del script si necesitas borrar y recrear todo desde cero.*

**Paso B: Popular Datos (Seed)**  
Este script inserta usuarios básicos (Admin, Profesor, Alumno) para pruebas.
```bash
node src/scripts/seed-users.js
```

---

## 🏃 Ejecución de la Aplicación

### Modo Desarrollo
Inicia el servidor principal con `nodemon` para recarga automática:
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

### Ejecutar Tests
```bash
npm test
```

---

## 📡 Documentación de API

### Servicio Principal (`localhost:3000`)

#### 🔐 Autenticación
| Método | Endpoint | Descripción | Body Requerido |
|--------|----------|-------------|----------------|
| POST | `/api/auth/login` | Iniciar sesión | `{ "email": "...", "password": "..." }` |
| POST | `/api/auth/logout` | Cerrar sesión | - |

#### 👥 Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Listar usuarios |
| POST | `/api/usuarios` | Crear usuario |
| GET | `/api/usuarios/:id` | Ver usuario |
| PUT | `/api/usuarios/:id` | Editar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |

#### 🎓 Alumnos y Profesores
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/alumnos` | Listar alumnos |
| POST | `/api/alumnos` | Crear alumno (con persona asociada) |
| GET | `/api/profesores` | Listar profesores |
| POST | `/api/profesores` | Crear profesor |

#### 📄 Analíticos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/analiticos/:id.pdf` | Descargar analítico en PDF |

---

### 🧱 Microservicio de Gestión
Este servicio corre en un contenedor separado y gestiona datos auxiliares.
**URL Base**: `http://gestion.localhost` (vía Traefik) o puerto `3001` directo si está expuesto.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/gestion/cargos` | Listar cargos docentes |
| GET | `/api/gestion/categorias` | Listar categorías |
| GET | `/api/gestion/dedicaciones` | Listar dedicaciones |

---

## 📝 Detalles de Scripts

### `src/scripts/sync-db.js`
- **Función**: Sincroniza los modelos de Sequelize con la base de datos.
- **Detalle**: Utiliza `sequelize.sync({ alter: true })` para ajustar las tablas sin perder datos si es posible.

### `src/scripts/seed-users.js`
- **Función**: Inserta datos de prueba.
- **Datos generados**:
    - **Admin**: `admin@sysacad.com` / `12345678`
    - **Profesor**: `profesor@sysacad.com` / `12345678`
    - **Alumno**: `alumno@sysacad.com` / `12345678`
- **Lógica**: Verifica si el usuario ya existe por email antes de crearlo para evitar duplicados.
