# 📖 Wiki del Proyecto - Events App (Reservá la Fecha)

## 📋 Índice

1. [¿Qué es este proyecto?](#qué-es-este-proyecto)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Archivos de configuración](#archivos-de-configuración)
5. [Carpeta app/ (Páginas y Rutas)](#carpeta-app-páginas-y-rutas)
6. [Carpeta app/api/ (Backend/APIs)](#carpeta-appapi-backendapis)
7. [Carpeta lib/ (Lógica de negocio)](#carpeta-lib-lógica-de-negocio)
8. [Carpeta prisma/ (Base de datos)](#carpeta-prisma-base-de-datos)
9. [Variables de entorno](#variables-de-entorno)
10. [Flujo de la aplicación](#flujo-de-la-aplicación)
11. [Comandos útiles](#comandos-útiles)

---

## ¿Qué es este proyecto?

Una aplicación web para gestionar **eventos especiales** (bodas, cumpleaños, etc.) donde:
- Los **administradores** crean y gestionan eventos
- Los **invitados** confirman su asistencia (RSVP)
- Se pueden exportar las respuestas a Excel

### Ejemplo de flujo:
```
1. Admin crea evento "Boda de Adriel y María"
2. Admin comparte el link del evento al usuario
3. Usuario comparte el link del evento a sus invitados
4. Invitado abre el link → ve los detalles del evento
5. Invitado confirma asistencia → se guarda en la base de datos
6. Admin ve las confirmaciones en el dashboard
7. Usuario puede modificar datos de su evento y ver respuestas de invitados
```

---

## Tecnologías utilizadas

| Tecnología | ¿Qué hace? | Analogía |
|-----------|------------|----------|
| **Next.js** | Framework web (frontend + backend) | Es como el "esqueleto" de la app |
| **React** | Librería para crear interfaces | Los "bloques" visuales de la página |
| **TypeScript** | JavaScript con tipos | JavaScript pero más seguro |
| **Tailwind CSS** | Estilos/diseño | La "pintura" y decoración |
| **Prisma** | ORM para base de datos | El "traductor" entre código y base de datos |
| **PostgreSQL** | Base de datos | El "archivo" donde se guardan los datos |
| **Supabase** | PostgreSQL en la nube | El "archivo" pero en internet (producción) |
| **Docker** | Contenedores | Una "caja" que tiene PostgreSQL para desarrollo |
| **Vercel** | Hosting/Deploy | El "servidor" donde vive hoy la app en internet |
| **JWT** | Tokens de autenticación | La "llave" para acceder al panel admin |

---

## Estructura del proyecto

```
wedding-app/
├── app/                          # 📄 Páginas y rutas de la aplicación
│   ├── layout.tsx                # Layout principal (envuelve TODAS las páginas)
│   ├── page.tsx                  # Página principal "/"
│   ├── admin-login/
│   │   └── page.tsx              # Página de login "/admin-login"
│   ├── admin/
│   │   ├── layout.tsx            # Layout del admin (verifica autenticación)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard "/admin/dashboard"
│   │   └── events/
│   │       ├── create/
│   │       │   └── page.tsx      # Crear evento "/admin/events/create"
│   │       └── [id]/
│   │           ├── edit/
│   │           │   └── page.tsx  # Editar evento "/admin/events/123/edit"
│   │           └── rsvps/
│   │               └── page.tsx  # Ver RSVPs "/admin/events/123/rsvps"
│   └── api/                      # 🔧 Endpoints del backend (APIs)
│       ├── admin-login/
│       │   └── route.ts          # POST /api/admin-login
│       ├── check-auth/
│       │   └── route.ts          # GET /api/check-auth
│       └── events/
│           └── [id]/
│               └── route.ts      # GET/PUT/DELETE /api/events/123
├── lib/                          # 📚 Lógica de negocio reutilizable
│   ├── prisma.ts                 # Conexión a la base de datos
│   └── repositories/             # Funciones para acceder a datos
├── prisma/                       # 🗄️ Configuración de base de datos
│   ├── schema.prisma             # Esquema/estructura de las tablas
│   └── migrations/               # Historial de cambios en la BD
├── public/                       # 🖼️ Archivos estáticos (imágenes, etc.)
├── .env                          # Variables de entorno (Prisma CLI)
├── .env.local                    # Variables de entorno (Next.js desarrollo)
├── .gitignore                    # Archivos que Git ignora
├── docker-compose.yml            # Configuración de Docker (PostgreSQL local)
├── package.json                  # Dependencias y scripts del proyecto
├── tsconfig.json                 # Configuración de TypeScript
└── tailwind.config.ts            # Configuración de Tailwind CSS
```

---

## Archivos de configuración

### 📦 `package.json`
**¿Qué hace?** Define las dependencias (librerías) y los comandos del proyecto.

```json
{
  "scripts": {
    "dev": "next dev --turbopack",           // Inicia el servidor de desarrollo
    "build": "next build",                    // Compila para producción
    "vercel-build": "prisma generate && next build",  // Build en Vercel
    "start": "next start",                    // Inicia en producción
    "prisma:studio": "prisma studio"          // Abre editor visual de BD
  }
}
```

**Ejemplo de uso:**
```bash
npm run dev          # Abre http://localhost:3000
npm run prisma:studio # Abre editor visual de la base de datos
```

---

### 🐳 `docker-compose.yml`
**¿Qué hace?** Levanta un servidor PostgreSQL local para desarrollo.

```yaml
services:
  db:
    image: postgres:16-alpine    # Usa PostgreSQL versión 16
    ports:
      - "54322:5432"             # Puerto 54322 en tu máquina → 5432 en Docker
    environment:
      POSTGRES_USER: postgres    # Usuario de la BD
      POSTGRES_PASSWORD: password # Contraseña de la BD
```

**Ejemplo de uso:**
```bash
docker compose up -d    # Inicia PostgreSQL en segundo plano
docker compose down     # Detiene PostgreSQL
docker compose ps       # Ver si está corriendo
```

---

### ⚙️ `tsconfig.json`
**¿Qué hace?** Configura TypeScript. Le dice al compilador cómo tratar el código.

**No necesitas modificar este archivo normalmente.**

---

## Carpeta app/ (Páginas y Rutas)

### 🏠 `app/layout.tsx` - Layout Principal
**¿Qué hace?** Es el "marco" que envuelve TODAS las páginas. Define el HTML base, fuentes, metadata (título de la pestaña).

```tsx
// Cada página se renderiza DENTRO de este layout
// Es como el <html> y <body> de la aplicación

import type { Metadata, Viewport } from "next";

// Esto aparece en la pestaña del navegador
export const metadata: Metadata = {
  title: "Eventos Especiales",
  description: "Gestión de eventos especiales",
};

// Configuración de viewport (para celulares)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}  {/* ← Aquí se inserta cada página */}
      </body>
    </html>
  );
}
```

**Analogía:** Es como el marco de una foto. Cada página es una foto diferente, pero el marco siempre es el mismo.

---

### 🏠 `app/page.tsx` - Página Principal
**¿Qué hace?** Es la página que se ve en `/` (la raíz). Muestra la lista de eventos públicos.

**URL:** `https://reservalafecha.vercel.app/`

---

### 🔐 `app/admin-login/page.tsx` - Login de Admin
**¿Qué hace?** Muestra un formulario de contraseña para acceder al panel de administración.

```tsx
"use client";  // ← IMPORTANTE: Indica que este componente corre en el NAVEGADOR

// "use client" es necesario cuando usas:
// - useState (estado)
// - useRouter (navegación)
// - onClick (eventos)
// - Cualquier interactividad

export default function AdminLogin() {
  const [password, setPassword] = useState("");  // Estado del input

  const login = async () => {
    // Envía la contraseña al backend
    const res = await fetch("/api/admin-login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");  // Redirige al dashboard
    }
  };

  return (
    <input value={password} onChange={(e) => setPassword(e.target.value)} />
    // ...
  );
}
```

**Conceptos importantes:**
- `"use client"` → El código corre en el navegador del usuario
- Sin `"use client"` → El código corre en el servidor (por defecto en Next.js)
- `useState` → Guarda datos temporales (como lo que escribe el usuario)
- `fetch` → Envía datos al backend (como un formulario)

**URL:** `https://reservalafecha.vercel.app/admin-login`

---

### 🛡️ `app/admin/layout.tsx` - Layout del Admin
**¿Qué hace?** Protege TODAS las páginas dentro de `/admin/`. Si no estás logueado, te redirige al login.

```tsx
// Este archivo corre en el SERVIDOR (no tiene "use client")

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function AdminLayout({ children }) {
  // 1. Lee la cookie del navegador
  const token = cookieStore.get("admin-token")?.value;

  // 2. Si no hay token → al login
  if (!token) {
    redirect("/admin-login");
  }

  // 3. Si el token es inválido → al login
  try {
    jwt.verify(token, process.env.ADMIN_PASSWORD!);
  } catch {
    redirect("/admin-login");
  }

  // 4. Si todo está bien → muestra la página
  return <>{children}</>;
}
```

**Analogía:** Es como un guardia de seguridad. Antes de dejarte entrar a cualquier página de admin, verifica tu "pase" (token).

---

### 📊 `app/admin/dashboard/page.tsx` - Dashboard
**¿Qué hace?** Muestra el panel principal del admin con la lista de eventos creados.

**URL:** `https://reservalafecha.vercel.app/admin/dashboard`

---

### ➕ `app/admin/events/create/page.tsx` - Crear Evento
**¿Qué hace?** Formulario para crear un nuevo evento.

**URL:** `https://reservalafecha.vercel.app/admin/events/create`

---

### ✏️ `app/admin/events/[id]/edit/page.tsx` - Editar Evento
**¿Qué hace?** Formulario para editar un evento existente.

```
[id] es un parámetro dinámico.
Si el evento tiene id "abc123":
URL: /admin/events/abc123/edit
```

**Conceptos importantes:**
```tsx
// [id] en la carpeta = parámetro dinámico
// Next.js lo pasa como prop:

export default function EditEvent({ params }: { params: { id: string } }) {
  // params.id = "abc123"
  // Usa este ID para cargar el evento de la base de datos
}
```

---

### 📋 `app/admin/events/[id]/rsvps/page.tsx` - Ver RSVPs
**¿Qué hace?** Muestra la lista de invitados que confirmaron asistencia a un evento.

**URL:** `https://reservalafecha.vercel.app/admin/events/abc123/rsvps`

---

## Carpeta app/api/ (Backend/APIs)

Las carpetas dentro de `app/api/` son **endpoints del backend**. No son páginas visuales, sino que reciben y envían datos en formato JSON.

### 🔑 `app/api/admin-login/route.ts`
**¿Qué hace?** Recibe la contraseña, la verifica y devuelve un token (cookie).

```
POST /api/admin-login
Body: { "password": "casamiento2026" }

→ Si es correcta: Devuelve cookie "admin-token" con JWT
→ Si es incorrecta: Devuelve error 401
```

**Ejemplo de flujo:**
```
1. Usuario escribe "casamiento2026" en el input
2. Frontend envía POST a /api/admin-login
3. Backend compara con process.env.ADMIN_PASSWORD
4. Si coincide → crea JWT → lo guarda en cookie → devuelve 200
5. Si no coincide → devuelve 401
```

**¿Qué es JWT?**
Un JWT (JSON Web Token) es un texto cifrado que contiene información.
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4ifQ.abc123
```
Es como un "pase de entrada" que demuestra que ya te logueaste.

---

### ✅ `app/api/check-auth/route.ts`
**¿Qué hace?** Verifica si el usuario está autenticado (si su token es válido).

```
GET /api/check-auth

→ Si tiene token válido: { "authenticated": true }
→ Si no tiene token: Error 401
```

---

### 📅 `app/api/events/[id]/route.ts`
**¿Qué hace?** CRUD de eventos (Crear, Leer, Actualizar, Eliminar).

```
GET    /api/events/abc123     → Obtiene el evento
PUT    /api/events/abc123     → Actualiza el evento
DELETE /api/events/abc123     → Elimina el evento
```

**Ejemplo:**
```typescript
// GET: Obtener un evento
export async function GET(req, { params }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id }
  });
  return NextResponse.json(event);
}
```

---

## Carpeta lib/ (Lógica de negocio)

### 🔌 `lib/prisma.ts` - Conexión a Base de Datos
**¿Qué hace?** Crea y exporta una instancia única de Prisma Client para conectarse a la BD.

```typescript
import { PrismaClient } from "@prisma/client";

// En desarrollo: reutiliza la conexión para no crear muchas
// En producción: crea una nueva conexión

const prisma = new PrismaClient();
export default prisma;
```

**Analogía:** Es como un "cable" que conecta tu código con la base de datos. Solo necesitas un cable, no uno por cada consulta.

---

### 📂 `lib/repositories/` - Repositorios
**¿Qué hace?** Contiene las funciones que interactúan con la base de datos.

```typescript
// Ejemplo: obtener todos los eventos
async function getAllEvents() {
  return await prisma.event.findMany();
}

// Ejemplo: crear un evento
async function createEvent(data) {
  return await prisma.event.create({ data });
}

// Ejemplo: buscar evento por ID
async function getEventById(id: string) {
  return await prisma.event.findUnique({ where: { id } });
}
```

**Analogía:** Son como los "cajeros" de un banco. Tú les pides datos y ellos van a buscarlos a la base de datos.

---

## Carpeta prisma/ (Base de datos)

### 📐 `prisma/schema.prisma` - Esquema de la BD
**¿Qué hace?** Define la estructura de las tablas de la base de datos.

```prisma
// Conexión a la base de datos
datasource db {
  provider  = "postgresql"        // Tipo de BD
  url       = env("DATABASE_URL") // URL de conexión
  directUrl = env("DIRECT_URL")   // URL directa (para migraciones)
}

// Generador del cliente
generator client {
  provider = "prisma-client-js"
}

// Tabla "Event" (Eventos)
model Event {
  id          String   @id @default(uuid())   // ID único
  name        String                           // Nombre del evento
  date        DateTime                         // Fecha
  location    String                           // Ubicación
  description String?                          // Descripción (opcional)
  createdAt   DateTime @default(now())         // Fecha de creación
  rsvps       Rsvp[]                           // Relación con RSVPs
  config      EventConfig?                     // Configuración del evento
}

// Tabla "Rsvp" (Confirmaciones de asistencia)
model Rsvp {
  id        String   @id @default(uuid())
  name      String                             // Nombre del invitado
  attending Boolean                            // ¿Asiste? Sí/No
  guests    Int      @default(1)               // Cantidad de acompañantes
  message   String?                            // Mensaje (opcional)
  eventId   String                             // ID del evento
  event     Event    @relation(fields: [eventId], references: [id])
}
```

**Analogía:** Es como el "plano" de una casa. Define qué habitaciones (tablas) hay y qué muebles (columnas) tiene cada una.

**Conceptos importantes:**
- `@id` → Es la clave primaria (identificador único)
- `@default(uuid())` → Se genera automáticamente un ID único
- `String?` → El `?` significa que es opcional
- `@relation` → Conecta dos tablas (un evento tiene muchos RSVPs)

---

### 📜 `prisma/migrations/` - Migraciones
**¿Qué hace?** Guarda el historial de cambios en la estructura de la BD.

```
prisma/migrations/
└── 20260224182746_init/
    └── migration.sql    ← SQL que crea las tablas
```

**Analogía:** Es como un "historial de reformas" de una casa. Cada migración registra qué cambios se hicieron.

---

## Variables de entorno

### 📄 `.env` (para Prisma CLI)
```bash
DATABASE_URL="postgresql://postgres:password@localhost:54322/postgres"
DIRECT_URL="postgresql://postgres:password@localhost:54322/postgres"
```

### 📄 `.env.local` (para Next.js en desarrollo)
```bash
ADMIN_PASSWORD=casamiento2026
DATABASE_URL="postgresql://postgres:password@localhost:54322/postgres"
DIRECT_URL="postgresql://postgres:password@localhost:54322/postgres"
```

### ☁️ Variables en Vercel (producción)
```bash
ADMIN_PASSWORD=casamiento2026
DATABASE_URL=postgresql://postgres.xxx:password@supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:password@supabase.com:5432/postgres
```

**Resumen:**
| Variable | ¿Para qué? |
|----------|------------|
| `DATABASE_URL` | Conectar a la base de datos (con pooler en producción) |
| `DIRECT_URL` | Conexión directa para migraciones |
| `ADMIN_PASSWORD` | Contraseña del panel de administración |

---

## Flujo de la aplicación

### 🔄 Flujo del Invitado
```
1. Invitado abre el link del evento
   → GET /api/events/[id]
   → Se muestra la página del evento

2. Invitado completa el formulario de RSVP
   → POST /api/events/[id]/rsvp
   → Se guarda en la tabla Rsvp

3. Se muestra confirmación ✅
```

### 🔄 Flujo del Administrador
```
1. Admin va a /admin-login
   → Escribe la contraseña

2. POST /api/admin-login
   → Se verifica la contraseña
   → Se crea JWT y se guarda en cookie

3. Redirige a /admin/dashboard
   → admin/layout.tsx verifica el token
   → Si es válido → muestra el dashboard
   → Si no → redirige al login

4. Admin crea/edita/elimina eventos
   → POST/PUT/DELETE /api/events/[id]

5. Admin ve las confirmaciones
   → GET /api/events/[id]/rsvps

6. Usuario edita/muestra el dashboard de su evento
   → GET/PUT /api/events/[id]
```

### 🔄 Flujo de Deploy
```
1. Haces cambios en tu código
2. git add . → git commit → git push origin main
3. Vercel detecta el push automáticamente
4. Vercel ejecuta "vercel-build":
   a. prisma generate (genera el cliente de BD)
   b. next build (compila la app)
5. Si todo OK → Deploy exitoso ✅
6. La app está disponible en https://reservalafecha.vercel.app
```

---

## Comandos útiles

### Desarrollo local
```bash
# Iniciar el contenedor de PostgreSQL (si ya existe)
docker start events-postgres

# Si es la primera vez (crear contenedor desde compose)
docker compose up -d

# Si hay conflicto de nombre con docker compose:
# Usa "docker start events-postgres" en lugar de "docker compose up"

# Verificar que el contenedor está corriendo
docker ps

# Iniciar el servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
```

### Prisma (Base de datos)
```bash
# Abrir editor visual de la BD
npm run prisma:studio

# Crear una nueva migración (después de cambiar schema.prisma)
npx prisma migrate dev --name nombre_del_cambio

# Sincronizar esquema sin migración
npm run prisma:push

# Regenerar el cliente de Prisma
npm run prisma:generate
```

### Git (Control de versiones)
```bash
# Ver estado de cambios
git status

# Agregar cambios
git add .

# Crear commit
git commit -m "Descripción del cambio"

# Subir a GitHub (activa deploy en Vercel)
git push origin main

# Ver en qué rama estás
git branch
```

### Docker
```bash
# Iniciar contenedor existente
docker start events-postgres

# Detener contenedor
docker stop events-postgres

# Ver contenedores corriendo
docker ps

# Ver TODOS los contenedores (incluso detenidos)
docker ps -a

# Ver logs del contenedor
docker logs events-postgres

# Si necesitas crear el contenedor desde cero (primera vez)
docker compose up -d

# Si hay conflicto de nombre al usar docker compose:
# 1. Eliminar el contenedor viejo
docker rm events-postgres
# 2. Luego crear de nuevo
docker compose up -d

# Detener y eliminar contenedores del compose
docker compose down
```

### Resumen rápido: Iniciar el proyecto en local
```bash
# Paso 1: Iniciar la base de datos
docker start events-postgres

# Paso 2: Verificar que está corriendo
docker ps

# Paso 3: Iniciar la app
npm run dev

# Paso 4: Abrir en el navegador
# http://localhost:3000
# Admin: http://localhost:3000/admin-login (contraseña: casamiento2026)
```

---

## Glosario de términos

| Término | Significado |
|---------|-------------|
| **API** | Interfaz para que el frontend y backend se comuniquen |
| **Backend** | La parte del servidor (maneja datos, lógica) |
| **Cookie** | Pequeño archivo que el navegador guarda (ej: token de login) |
| **CRUD** | Create, Read, Update, Delete (operaciones básicas) |
| **Deploy** | Publicar la app en internet |
| **Endpoint** | Una URL del backend que recibe/envía datos |
| **Frontend** | La parte visual que ve el usuario |
| **JWT** | Token cifrado para autenticación |
| **Migración** | Cambio en la estructura de la base de datos |
| **ORM** | Herramienta que traduce código a SQL (Prisma) |
| **Props** | Datos que se pasan entre componentes de React |
| **RSVP** | "Répondez s'il vous plaît" (confirmar asistencia) |
| **Schema** | Estructura/definición de las tablas |
| **State** | Datos temporales de un componente (useState) |
| **Token** | Texto cifrado que prueba tu identidad |
| **`"use client"`** | Indica que el componente corre en el navegador |
