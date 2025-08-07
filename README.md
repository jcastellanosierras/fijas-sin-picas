# Fijas Sin Picas - Monorepo

Este es un monorepo que contiene todas las aplicaciones del juego "Fijas Sin Picas" utilizando pnpm workspaces.

## Estructura del Proyecto

```
fijas-sin-picas/
├── packages/
│   ├── backend/          # API NestJS
│   └── web-client/       # Frontend React + Vite
├── pnpm-workspace.yaml   # Configuración de workspaces
└── package.json          # Configuración raíz del monorepo
```

## Requisitos

- Node.js (versión 18 o superior)
- pnpm (gestor de paquetes)

## Instalación

```bash
# Instalar dependencias de todos los workspaces
pnpm install
```

## Scripts Disponibles

### Backend (NestJS API)

```bash
# Desarrollo del backend
pnpm run dev:backend

# Compilar el backend
pnpm run build:backend

# Ejecutar tests del backend
pnpm run test:backend

# Lint del backend
pnpm run lint:backend
```

### Frontend (React + Vite)

```bash
# Desarrollo del frontend
pnpm run dev:frontend

# Compilar el frontend
pnpm run build:frontend

# Lint del frontend
pnpm run lint:frontend

# Preview del build
pnpm run preview:frontend
```

### Scripts globales

```bash
# Desarrollo (ejecuta el backend)
pnpm run dev

# Desarrollo de todas las aplicaciones en paralelo
pnpm run dev:all

# Compilar todo
pnpm run build

# Ejecutar todos los tests
pnpm run test

# Lint de todo el proyecto
pnpm run lint
```

## Añadir nuevas aplicaciones

Para añadir nuevas aplicaciones cliente (frontend), simplemente:

1. Crea un nuevo directorio en `packages/`
2. Añade su `package.json` con el nombre `@fijas-sin-picas/nombre-app`
3. pnpm automáticamente lo detectará como un nuevo workspace

Ejemplo:
```bash
mkdir packages/web-client
cd packages/web-client
# Crear package.json y código de la aplicación
```

## Workspaces

Este proyecto utiliza pnpm workspaces para gestionar múltiples paquetes en un solo repositorio. Cada paquete en `packages/` es un workspace independiente con sus propias dependencias.

### Comandos útiles de workspaces

```bash
# Ejecutar comando en un workspace específico
pnpm --filter @fijas-sin-picas/backend <comando>

# Instalar dependencia en un workspace específico
pnpm --filter @fijas-sin-picas/backend add <paquete>

# Listar todos los workspaces
pnpm ls --depth=-1
```