# 🎓 Sysacad App

👨‍💻 **Desarrollado por:**

- Branko Almeira  
- Federico Sosa  
- Agustin Giorlando  

Aplicación académica desarrollada en **Node.js** con **Express** y **Sequelize**, conectada a **PostgreSQL** (Docker).  
El proyecto implementa una arquitectura **modular por capas** que favorece la escalabilidad, mantenibilidad y testabilidad.

---

## 📂 Arquitectura

El código se organiza bajo el principio de **separación de responsabilidades**, siguiendo una arquitectura por capas:

```
src/
  config/         # Configuración (ej. conexión a la DB)
  controllers/    # Controladores HTTP (req/res)
  entities/       # Entidades/DTOs (representación lógica de dominio)
  middlewares/    # Middlewares genéricos (auth, manejo de errores, etc.)
  models/         # Modelos Sequelize (mapeo ORM ↔ DB)
  repositories/   # Acceso a datos (queries usando los modelos)
  routes/         # Definición de rutas y vinculación a controladores
  services/       # Lógica de negocio
  tests/          # Tests unitarios e integración
```

---

## 🚀 Tecnologías principales

- **Node.js** v20+  
- **Express.js** (framework web)  
- **Sequelize ORM**  
- **PostgreSQL 15** (contenedor Docker)  
- **Jest + Supertest** (testing)  
- **Docker Compose** (infraestructura reproducible)  
- **dotenv** (gestión de configuración)  

---

## ⚙️ Configuración de entorno

El proyecto utiliza un archivo `.env` para parametrizar la conexión a la base de datos y el puerto de la aplicación:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=sysacad
DB_USER=postgres_user
DB_PASSWORD=postgres_user
JWT_SECRET=una_clave_secreta_segura
```

---

## 🐳 Levantar la base de datos con Docker

```bash
docker compose up -d
```

Esto levanta un contenedor PostgreSQL en el puerto **5433** de tu host, aislando el servicio de posibles conflictos con instalaciones locales.

---

## 📌 Scripts principales

En `package.json`:

- `npm run dev` → inicia el servidor con nodemon.  
- `npm start` → inicia el servidor en modo producción.  
- `npm test` → ejecuta la suite de tests con Jest.  

---

## 📡 Endpoints disponibles

**Base URL por defecto:** `http://localhost:3000`  

### 👥 Usuarios
| Método | Endpoint            | Descripción                               | Body (JSON ejemplo) |
|--------|---------------------|-------------------------------------------|---------------------|
| GET    | `/api/usuarios`     | Lista todos los usuarios                  | - |
| GET    | `/api/usuarios/:id` | Obtiene un usuario por ID                 | - |
| POST   | `/api/usuarios`     | Crea un nuevo usuario                     | ```{ "nombre": "Juan", "email": "juan@test.com", "password": "ClaveSegura123", "rol": "alumno" }``` |
| PUT    | `/api/usuarios/:id` | Actualiza datos de un usuario existente   | ```{ "nombre": "Juan Actualizado", "rol": "profesor" }``` |
| DELETE | `/api/usuarios/:id` | Elimina un usuario por ID                 | - |

---

### 📄 Analíticos (PDF)

> Generación on-the-fly de analítico de un alumno en formato **PDF**.  
> Asegúrate de haber agregado la ruta en `src/app.js`:  
> `app.use('/api/analiticos', analiticosRouter);`

| Método | Endpoint                          | Descripción                           | Headers / Respuesta |
|--------|-----------------------------------|---------------------------------------|---------------------|
| GET    | `/api/analiticos/:alumnoId.pdf`   | Devuelve el Analítico del alumno en PDF | **Response**: `Content-Type: application/pdf` |

**Ejemplos de uso (Postman):**  
1. Método: `GET`  
2. URL: `http://localhost:3000/api/analiticos/123.pdf`  
3. Headers: *(no requiere especiales)*  
4. **Respuesta**: mostrará/descargará `analitico_123.pdf` (inline).

**Ejemplo cURL:**
```bash
curl -X GET "http://localhost:3000/api/analiticos/123.pdf" -o analitico_123.pdf
```

> **Notas**
> - Si el `alumnoId` no existe, el endpoint responde `404 { "error": "Alumno no encontrado" }`.
> - Si deseas forzar descarga en lugar de inline, cambia el header `Content-Disposition` a `attachment` en el controlador.

---

## 🔎 Cómo probar con Postman

1. **Levantar la app**:  
   ```bash
   npm run dev
   ```

2. **Configurar colección en Postman**:  
   - Crear una nueva colección llamada **Sysacad App**.  
   - Definir la variable `base_url = http://localhost:3000`.  

3. **Usuarios — Crear** (POST `{{base_url}}/api/usuarios`)  
   **Body (raw JSON):**
   ```json
   {
     "nombre": "María López",
     "email": "maria@example.com",
     "password": "ClaveSegura123",
     "rol": "profesor"
   }
   ```

4. **Usuarios — Update** (PUT `{{base_url}}/api/usuarios/1`)  
   **Body:**
   ```json
   {
     "nombre": "María Actualizada",
     "rol": "admin"
   }
   ```

5. **Usuarios — Delete** (DELETE `{{base_url}}/api/usuarios/1`)

6. **Analíticos — Descargar PDF** (GET `{{base_url}}/api/analiticos/123.pdf`)  
   - Respuesta: PDF del analítico.  
   - En Postman, pestaña **“Save Response”** para guardar el archivo si lo necesitás.

---

## 🧪 Testing

- **Unit tests**: validan la lógica de negocio y servicios con dependencias mockeadas.  
- **Integration tests**: prueban rutas HTTP completas con base de datos real/efímera.  

Ejecutar:

```bash
npm test
```

---

## ✅ Mejoras futuras

- Implementar autenticación con JWT (cookies httpOnly).  
- Incorporar más entidades académicas (materias, facultades, inscripciones, calificaciones).  
