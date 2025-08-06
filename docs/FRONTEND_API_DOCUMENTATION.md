# Documentación de API para Frontend - Juego "Fijas Sin Picas"

## Introducción

Este documento contiene toda la información necesaria para desarrollar un cliente frontend para el juego "Fijas Sin Picas". Es un juego de adivinanzas para dos jugadores donde cada jugador debe adivinar el número secreto de 4 dígitos del oponente.

## Servidor

- **Base URL**: `http://localhost:3000` (por defecto en desarrollo)
- **Protocolo**: HTTP REST API
- **Content-Type**: `application/json`

## Conceptos del Juego

### ¿Qué es "Fijas Sin Picas"?

Es un juego de lógica donde dos jugadores:
1. Cada uno elige un número secreto de 4 dígitos
2. Por turnos, hacen adivinanzas del número secreto del oponente
3. Reciben pistas sobre qué tan cerca están:
   - **Fijas**: Dígitos correctos en la posición correcta
   - En este API solo se reportan las "fijas" (coincidencias exactas)
4. Gana quien adivine primero el número completo del oponente

### Estados del Juego

```typescript
enum RoomState {
  WAITING = 'waiting',           // Esperando que se una el segundo jugador
  SETTING_SECRETS = 'setting_secrets',  // Jugadores estableciendo números secretos
  IN_PROGRESS = 'in_progress',   // Juego en curso
  FINISHED = 'finished'          // Juego terminado
}
```

## Endpoints de la API

### 1. Crear Sala

**`POST /rooms`**

Crea una nueva sala de juego y asigna al creador como jugador 1.

#### Request Body
```typescript
{
  "code": string,      // Código único de la sala (4-50 caracteres)
  "password": string,  // Contraseña de la sala (4-50 caracteres)
  "username": string   // Nombre del jugador host (4-50 caracteres)
}
```

#### Response
```typescript
{
  "id": string,              // UUID de la sala
  "code": string,            // Código de la sala
  "state": "waiting",        // Estado inicial siempre es 'waiting'
  "players": [
    {
      "id": string,          // UUID del jugador
      "username": string     // Nombre del jugador
    },
    null                     // Segundo jugador aún no se ha unido
  ],
  "currentTurn": 0,
  "currentTurnPlayerId": null,
  "createdAt": string        // ISO timestamp
}
```

#### Errores
- `400`: Código ya existe, validación de datos fallida, campos requeridos faltantes

---

### 2. Obtener Información de Sala

**`GET /rooms/:code`**

Obtiene información actual de una sala específica.

#### URL Parameters
- `code`: Código de la sala

#### Response
```typescript
{
  "id": string,
  "code": string,
  "state": RoomState,
  "players": [
    {
      "id": string,
      "username": string,
      "guesses"?: Guess[]    // Solo visible en ciertos estados
    },
    {
      "id": string,
      "username": string,
      "guesses"?: Guess[]
    }
  ],
  "currentTurn": number,
  "currentTurnPlayerId": string | null,
  "winner"?: string,         // ID del ganador si el juego terminó
  "createdAt": string
}
```

#### Errores
- `404`: Sala no encontrada

---

### 3. Unirse a Sala

**`POST /rooms/:code/join`**

Permite que un segundo jugador se una a una sala existente.

#### URL Parameters
- `code`: Código de la sala

#### Request Body
```typescript
{
  "password": string,  // Contraseña de la sala
  "username": string   // Nombre del jugador (4-50 caracteres, único en la sala)
}
```

#### Response
```typescript
{
  "playerId": string,        // UUID del jugador que se unió
  "roomId": string,          // UUID de la sala
  "code": string,            // Código de la sala
  "state": "setting_secrets", // Estado cambia automáticamente
  "players": [
    {
      "id": string,
      "username": string
    },
    {
      "id": string,
      "username": string
    }
  ]
}
```

#### Errores
- `400`: Contraseña incorrecta, sala llena, nombre de usuario ya existe
- `404`: Sala no encontrada

---

### 4. Establecer Número Secreto

**`POST /rooms/:roomId/secret/:playerId`**

Permite a un jugador establecer su número secreto de 4 dígitos.

#### URL Parameters
- `roomId`: UUID de la sala
- `playerId`: UUID del jugador

#### Request Body
```typescript
{
  "secret": string  // Exactamente 4 dígitos numéricos (ej: "1234", "0001")
}
```

#### Response
```
200 OK
```
Sin contenido en el body. Cuando ambos jugadores establezcan sus secretos, el estado de la sala cambiará automáticamente a `IN_PROGRESS`.

#### Errores
- `400`: Sala no en estado `SETTING_SECRETS`, secreto ya establecido, formato inválido
- `404`: Sala o jugador no encontrado

---

### 5. Hacer Adivinanza

**`POST /rooms/:roomId/guess/:playerId`**

Permite a un jugador hacer una adivinanza del número secreto del oponente.

#### URL Parameters
- `roomId`: UUID de la sala
- `playerId`: UUID del jugador

#### Request Body
```typescript
{
  "guess": string  // Exactamente 4 dígitos numéricos
}
```

#### Response
```typescript
{
  "id": string,              // UUID de la adivinanza
  "guess": string,           // La adivinanza realizada
  "exactMatches": number,    // Número de fijas (0-4)
  "nextTurnPlayer": {
    "id": string,
    "username": string
  },
  "currentTurn": number,     // Número del turno actual
  "state": RoomState,        // Estado de la sala
  "winner"?: {               // Solo presente si el juego terminó
    "id": string,
    "username": string,
    "secret"?: string,
    "guesses": Guess[]
  }
}
```

#### Comportamiento del Juego
- Si `exactMatches` es 4: El jugador gana, `state` se convierte en `FINISHED`
- Si `exactMatches` es menos de 4: El juego continúa, cambia al turno del oponente
- Los turnos se incrementan cuando ambos jugadores han hecho al menos una adivinanza en el turno actual

#### Errores
- `400`: No es el turno del jugador, sala no en estado `IN_PROGRESS`, formato de adivinanza inválido
- `404`: Sala o jugador no encontrado

---

## Tipos de Datos

### Player
```typescript
interface Player {
  id: string;
  username: string;
  secret?: string;     // Solo visible para el propio jugador
  guesses: Guess[];
}
```

### Guess
```typescript
interface Guess {
  id: string;
  playerId: string;
  guess: string;       // 4 dígitos
  result?: number;     // Número de coincidencias exactas
  createdAt: Date;
}
```

### Room
```typescript
interface Room {
  id: string;
  code: string;
  password: string;    // No se expone en responses
  state: RoomState;
  players: [Player | null, Player | null];
  currentTurn: number;
  currentTurnPlayerId: string | null;
  winner?: string;
  createdAt: Date;
}
```

## Flujo del Juego

### 1. Creación e Ingreso
```
1. Jugador 1: POST /rooms (crea sala)
2. Jugador 2: POST /rooms/:code/join (se une)
   → Estado: SETTING_SECRETS
```

### 2. Configuración
```
3. Ambos jugadores: POST /rooms/:roomId/secret/:playerId
   → Cuando ambos establezcan secretos: Estado: IN_PROGRESS
```

### 3. Juego
```
4. Jugadores alternan: POST /rooms/:roomId/guess/:playerId
   → Si exactMatches === 4: Estado: FINISHED
   → Si no: Continúa el juego
```

### 4. Consulta de Estado
```
En cualquier momento: GET /rooms/:code
```

## Reglas de Validación

### Nombres de Usuario
- Longitud: 4-50 caracteres
- Debe ser único dentro de la sala
- Sensible a mayúsculas y minúsculas

### Códigos de Sala
- Longitud: 4-50 caracteres
- Deben ser únicos globalmente
- Sensibles a mayúsculas y minúsculas

### Contraseñas
- Longitud: 4-50 caracteres

### Números Secretos y Adivinanzas
- Exactamente 4 caracteres
- Solo dígitos numéricos (0-9)
- Se permiten ceros a la izquierda (ej: "0001")

## Errores Comunes

### Códigos de Estado HTTP
- `200`: Éxito
- `201`: Creación exitosa
- `400`: Error de validación o lógica de negocio
- `404`: Recurso no encontrado

### Mensajes de Error Típicos
```typescript
// Ejemplos de responses de error
{
  "statusCode": 400,
  "message": "Room with this code already exists"
}

{
  "statusCode": 400,
  "message": "Invalid password"
}

{
  "statusCode": 400,
  "message": "Player is not the current turn player"
}

{
  "statusCode": 404,
  "message": "Room with code ABC123 not found"
}
```

## Consideraciones de Implementación

### Polling para Estado del Juego
Dado que es una API REST sin WebSockets, el frontend debe:
1. Hacer polling regular a `GET /rooms/:code` para verificar cambios de estado
2. Especialmente importante cuando se espera que el oponente:
   - Se una a la sala
   - Establezca su número secreto
   - Haga su adivinanza

### Gestión de Turnos
- Solo el jugador cuyo `id` coincide con `currentTurnPlayerId` puede hacer adivinanzas
- Después de cada adivinanza, verificar el `nextTurnPlayer` en la response

### Persistencia
- Los datos se almacenan en memoria en el servidor
- Al reiniciar el servidor, todas las salas se pierden
- No hay persistencia en base de datos

### Seguridad
- Los números secretos no se exponen en las APIs
- Solo se revelan cuando el juego termina
- No hay autenticación; se identifica por IDs únicos

## Ejemplo de Implementación Frontend

### Flujo Básico con JavaScript/TypeScript

```typescript
// 1. Crear sala
const createRoom = async (code: string, password: string, username: string) => {
  const response = await fetch('/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, password, username })
  });
  return response.json();
};

// 2. Unirse a sala
const joinRoom = async (code: string, password: string, username: string) => {
  const response = await fetch(`/rooms/${code}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, username })
  });
  return response.json();
};

// 3. Establecer secreto
const setSecret = async (roomId: string, playerId: string, secret: string) => {
  const response = await fetch(`/rooms/${roomId}/secret/${playerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret })
  });
  return response.ok;
};

// 4. Hacer adivinanza
const makeGuess = async (roomId: string, playerId: string, guess: string) => {
  const response = await fetch(`/rooms/${roomId}/guess/${playerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guess })
  });
  return response.json();
};

// 5. Obtener estado de sala (para polling)
const getRoomState = async (code: string) => {
  const response = await fetch(`/rooms/${code}`);
  return response.json();
};

// Ejemplo de polling
const startPolling = (code: string, callback: (room: any) => void) => {
  const poll = async () => {
    try {
      const room = await getRoomState(code);
      callback(room);
    } catch (error) {
      console.error('Error polling room state:', error);
    }
  };
  
  return setInterval(poll, 2000); // Poll cada 2 segundos
};
```

## Diagrama de Estados

```
WAITING
  ↓ (segundo jugador se une)
SETTING_SECRETS
  ↓ (ambos jugadores establecen secretos)
IN_PROGRESS
  ↓ (un jugador adivina correctamente)
FINISHED
```

## Consejos para UX

1. **Indicadores Visuales**: Mostrar claramente de quién es el turno
2. **Estado de Carga**: Indicar cuando se están enviando requests
3. **Validación en Tiempo Real**: Validar formatos antes de enviar
4. **Historial de Adivinanzas**: Mostrar adivinanzas previas y sus resultados
5. **Notificaciones**: Alertar cuando el oponente haga un movimiento
6. **Códigos de Sala**: Facilitar el compartir códigos de sala
7. **Reconnection**: Permitir volver a ingresar a una sala existente

---

Esta documentación cubre todos los aspectos necesarios para implementar un cliente frontend completo para el juego "Fijas Sin Picas". El API es RESTful y directo, con validaciones claras y manejo de errores predecible.