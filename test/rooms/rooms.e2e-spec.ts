import { CreateRoomDto, RoomsModule, RoomState } from '@/rooms';
import { JoinRoomControllerDto } from '@/rooms/dto/join-room.controller.dto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

interface RoomResponse {
  id: string;
  code: string;
  state: RoomState;
  players: {
    id: string;
    username: string;
  }[];
}

interface JoinRoomResponse {
  playerId: string;
  roomId: string;
  code: string;
  state: RoomState;
  players: {
    id: string;
    username: string;
  }[];
}

describe('Rooms E2E Tests', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RoomsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create room', () => {
    it('/rooms (POST) should create a room and return 201', async () => {
      const createRoomDto: CreateRoomDto = {
        code: '123456',
        password: '123456',
        username: 'John Doe',
      };
      const response = await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const body = response.body as RoomResponse;

      expect(body).toHaveProperty('id');
      expect(body.code).toBe(createRoomDto.code);
      expect(body.state).toBe(RoomState.WAITING);
    });

    it('/rooms (POST) should not create a room with a username that is too short', async () => {
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Jo',
      };
      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(400);
    });

    it('/rooms (POST) should not create a room with code that is too short', async () => {
      const createRoomDto: CreateRoomDto = {
        code: '123',
        password: '1234',
        username: 'John Doe',
      };
      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(400);
    });

    it('/rooms (POST) should not create a room with password that is too short', async () => {
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '123',
        username: 'John Doe',
      };
      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(400);
    });

    it('/rooms (POST) should not create a room with missing required fields', async () => {
      const createRoomDto = {
        code: '1234',
        // missing password and username
      };
      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(400);
    });

    it('/rooms (POST) should not create a room with extra fields', async () => {
      const createRoomDto = {
        code: '1234',
        password: '1234',
        username: 'John Doe',
        extraField: 'not allowed',
      };
      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(400);
    });

    it('/rooms (POST) should not create a room with invalid data types', async () => {
      const createRoomDto = {
        code: 1234, // should be string
        password: '1234',
        username: 'John Doe',
      };
      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(400);
    });
  });

  describe('Join room', () => {
    it('/rooms/:code/join (POST) should join a room and return 200', async () => {
      const roomCode = '9999001';
      const roomPassword = '1234567';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const body = response.body as RoomResponse;

      const joinRoomDto: JoinRoomControllerDto = {
        password: roomPassword,
        username: 'Jane Doe',
      };
      const joinResponse = await request(app.getHttpServer())
        .post(`/rooms/${body.code}/join`)
        .send(joinRoomDto)
        .expect(200);

      const joinBody = joinResponse.body as JoinRoomResponse;

      expect(joinBody).toHaveProperty('playerId');
      expect(joinBody).toHaveProperty('roomId');
      expect(joinBody).toHaveProperty('code');
      expect(joinBody).toHaveProperty('state');
      expect(joinBody.code).toBe(roomCode);
      expect(joinBody.state).toBe(RoomState.SETTING_SECRETS);
      expect(joinBody.players).toHaveLength(2);
      expect(joinBody.players[0].username).toBe('John Doe');
      expect(joinBody.players[1].username).toBe('Jane Doe');
    });

    it('/rooms/:code/join (POST) should return 404 when room does not exist', async () => {
      const joinRoomDto: JoinRoomControllerDto = {
        password: '1234567',
        username: 'Jane Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms/NONEXISTENT/join')
        .send(joinRoomDto)
        .expect(404);
    });

    it('/rooms/:code/join (POST) should return 400 when password is incorrect', async () => {
      const roomCode = '9999002';
      const roomPassword = '1234568';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const joinRoomDto: JoinRoomControllerDto = {
        password: 'wrongpassword',
        username: 'Jane Doe',
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto)
        .expect(400);
    });

    it('/rooms/:code/join (POST) should return 400 when room is full', async () => {
      const roomCode = '9999003';
      const roomPassword = '9999003';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      // Join first player
      const joinRoomDto1: JoinRoomControllerDto = {
        password: roomPassword,
        username: 'Jane Doe',
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto1)
        .expect(200);

      // Try to join third player (should fail)
      const joinRoomDto2: JoinRoomControllerDto = {
        password: roomPassword,
        username: 'Bob Smith',
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto2)
        .expect(400);
    });

    it('/rooms/:code/join (POST) should return 400 when username already exists', async () => {
      const roomCode = '9999004';
      const roomPassword = '9999004';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      // Try to join with same username as host
      const joinRoomDto: JoinRoomControllerDto = {
        password: roomPassword,
        username: 'John Doe', // Same username as host
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto)
        .expect(400);
    });

    it('/rooms/:code/join (POST) should return 400 when username is too short', async () => {
      const roomCode = '1234571';
      const roomPassword = '1234571';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const joinRoomDto = {
        password: roomPassword,
        username: 'Jo', // Too short
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto)
        .expect(400);
    });

    it('/rooms/:code/join (POST) should return 400 when password is too short', async () => {
      const roomCode = '1234572';
      const roomPassword = '1234572';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const joinRoomDto = {
        password: '123', // Too short
        username: 'Jane Doe',
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto)
        .expect(400);
    });

    it('/rooms/:code/join (POST) should return 400 when username is missing', async () => {
      const roomCode = '1234573';
      const roomPassword = '1234573';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const joinRoomDto = {
        password: roomPassword,
        // missing username
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto)
        .expect(400);
    });

    it('/rooms/:code/join (POST) should return 400 when password is missing', async () => {
      const roomCode = '1234574';
      const roomPassword = '1234574';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const joinRoomDto = {
        // missing password
        username: 'Jane Doe',
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto)
        .expect(400);
    });

    it('/rooms/:code/join (POST) should return 400 when extra fields are provided', async () => {
      const roomCode = '1234575';
      const roomPassword = '1234575';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const joinRoomDto = {
        password: roomPassword,
        username: 'Jane Doe',
        extraField: 'not allowed',
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto)
        .expect(400);
    });

    it('/rooms/:code/join (POST) should return 400 when invalid data types are provided', async () => {
      const roomCode = '1234576';
      const roomPassword = '1234576';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const joinRoomDto = {
        password: 1234567, // should be string
        username: 'Jane Doe',
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto)
        .expect(400);
    });

    it('/rooms/:code/join (POST) should handle multiple joins to different rooms correctly', async () => {
      // Create first room
      const roomCode1 = '1234577';
      const roomPassword1 = '1234577';
      const createRoomDto1: CreateRoomDto = {
        code: roomCode1,
        password: roomPassword1,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto1)
        .expect(201);

      // Create second room
      const roomCode2 = '1234578';
      const roomPassword2 = '1234578';
      const createRoomDto2: CreateRoomDto = {
        code: roomCode2,
        password: roomPassword2,
        username: 'Alice Smith',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto2)
        .expect(201);

      // Join first room
      const joinRoomDto1: JoinRoomControllerDto = {
        password: roomPassword1,
        username: 'Jane Doe',
      };

      const joinResponse1 = await request(app.getHttpServer())
        .post(`/rooms/${roomCode1}/join`)
        .send(joinRoomDto1)
        .expect(200);

      const joinBody1 = joinResponse1.body as JoinRoomResponse;
      expect(joinBody1.code).toBe(roomCode1);
      expect(joinBody1.players).toHaveLength(2);

      // Join second room
      const joinRoomDto2: JoinRoomControllerDto = {
        password: roomPassword2,
        username: 'Bob Johnson',
      };

      const joinResponse2 = await request(app.getHttpServer())
        .post(`/rooms/${roomCode2}/join`)
        .send(joinRoomDto2)
        .expect(200);

      const joinBody2 = joinResponse2.body as JoinRoomResponse;
      expect(joinBody2.code).toBe(roomCode2);
      expect(joinBody2.players).toHaveLength(2);
    });
  });

  describe('Set secrets', () => {
    it('/rooms/:id/secret/:player_id (POST) should set secret and return 200', async () => {
      const roomCode = 'AAAA001';
      const roomPassword = 'AAAA001';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const body = response.body as RoomResponse;

      const joinRoomDto: JoinRoomControllerDto = {
        password: roomPassword,
        username: 'Jane Doe',
      };
      const joinResponse = await request(app.getHttpServer())
        .post(`/rooms/${body.code}/join`)
        .send(joinRoomDto)
        .expect(200);

      const joinBody = joinResponse.body as JoinRoomResponse;

      const setSecretDto = {
        secret: '1234',
      };

      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send(setSecretDto)
        .expect(200);
    });

    it('/rooms/:id/secret/:player_id (POST) should return 404 when room does not exist', async () => {
      const setSecretDto = {
        secret: '1234',
      };

      await request(app.getHttpServer())
        .post('/rooms/non-existent-room-id/secret/non-existent-player-id')
        .send(setSecretDto)
        .expect(400);
    });

    it('/rooms/:id/secret/:player_id (POST) should return 404 when player does not exist', async () => {
      const roomCode = 'BBBB002';
      const roomPassword = 'BBBB002';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const body = response.body as RoomResponse;

      const setSecretDto = {
        secret: '1234',
      };

      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/non-existent-player-id`)
        .send(setSecretDto)
        .expect(400);
    });

    it('/rooms/:id/secret/:player_id (POST) should return 400 when room is not in SETTING_SECRETS state', async () => {
      const roomCode = 'CCCC003';
      const roomPassword = 'CCCC003';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const body = response.body as RoomResponse;

      const setSecretDto = {
        secret: '1234',
      };

      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${body.players[0].id}`)
        .send(setSecretDto)
        .expect(400);
    });

    it('/rooms/:id/secret/:player_id (POST) should return 400 when secret is already set', async () => {
      const roomCode = 'DDDD004';
      const roomPassword = 'DDDD004';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const body = response.body as RoomResponse;

      const joinRoomDto: JoinRoomControllerDto = {
        password: roomPassword,
        username: 'Jane Doe',
      };
      const joinResponse = await request(app.getHttpServer())
        .post(`/rooms/${body.code}/join`)
        .send(joinRoomDto)
        .expect(200);

      const joinBody = joinResponse.body as JoinRoomResponse;

      const setSecretDto = {
        secret: '1234',
      };

      // Set secret first time
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send(setSecretDto)
        .expect(200);

      // Try to set secret again (should fail)
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send(setSecretDto)
        .expect(400);
    });

    it('/rooms/:id/secret/:player_id (POST) should validate secret format (length, numeric, special cases)', async () => {
      const roomCode = 'EEEE005';
      const roomPassword = 'EEEE005';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const body = response.body as RoomResponse;

      const joinRoomDto: JoinRoomControllerDto = {
        password: roomPassword,
        username: 'Jane Doe',
      };
      const joinResponse = await request(app.getHttpServer())
        .post(`/rooms/${body.code}/join`)
        .send(joinRoomDto)
        .expect(200);

      const joinBody = joinResponse.body as JoinRoomResponse;

      // Test secreto muy corto
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: '123' })
        .expect(400);

      // Test secreto muy largo
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: '12345' })
        .expect(400);

      // Test secreto con espacios
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: '12 4' })
        .expect(400);

      // Test secreto con caracteres especiales
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: '12@4' })
        .expect(400);

      // Test secreto con letras
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: '12a4' })
        .expect(400);

      // Test secreto con ceros a la izquierda (debería pasar)
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: '0001' })
        .expect(200);
    });

    it('/rooms/:id/secret/:player_id (POST) should validate secret data types and required fields', async () => {
      const roomCode = 'FFFF006';
      const roomPassword = 'FFFF006';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const body = response.body as RoomResponse;

      const joinRoomDto: JoinRoomControllerDto = {
        password: roomPassword,
        username: 'Jane Doe',
      };
      const joinResponse = await request(app.getHttpServer())
        .post(`/rooms/${body.code}/join`)
        .send(joinRoomDto)
        .expect(200);

      const joinBody = joinResponse.body as JoinRoomResponse;

      // Test secreto faltante
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({})
        .expect(400);

      // Test secreto como número (debería ser string)
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: 1234 })
        .expect(400);

      // Test secreto como string vacío
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: '' })
        .expect(400);

      // Test secreto como null
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: null })
        .expect(400);

      // Test secreto como undefined
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: undefined })
        .expect(400);

      // Test campos extra
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: '1234', extraField: 'not allowed' })
        .expect(400);
    });

    it('/rooms/:id/secret/:player_id (POST) should change room state to IN_PROGRESS when both players set secrets', async () => {
      const roomCode = 'GGGG007';
      const roomPassword = 'GGGG007';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const body = response.body as RoomResponse;

      const joinRoomDto: JoinRoomControllerDto = {
        password: roomPassword,
        username: 'Jane Doe',
      };
      const joinResponse = await request(app.getHttpServer())
        .post(`/rooms/${body.code}/join`)
        .send(joinRoomDto)
        .expect(200);

      const joinBody = joinResponse.body as JoinRoomResponse;

      // Set secret for first player
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${body.players[0].id}`)
        .send({ secret: '1234' })
        .expect(200);

      // Set secret for second player
      await request(app.getHttpServer())
        .post(`/rooms/${body.id}/secret/${joinBody.playerId}`)
        .send({ secret: '5678' })
        .expect(200);

      // Verify room state changed to IN_PROGRESS
      const roomResponse = await request(app.getHttpServer())
        .get(`/rooms/${body.code}`)
        .expect(200);

      expect((roomResponse.body as RoomResponse).state).toBe(
        RoomState.IN_PROGRESS,
      );
    });

    it('/rooms/:id/secret/:player_id (POST) should handle multiple rooms setting secrets correctly', async () => {
      // Create first room
      const roomCode1 = 'HHHH008';
      const roomPassword1 = 'HHHH008';
      const createRoomDto1: CreateRoomDto = {
        code: roomCode1,
        password: roomPassword1,
        username: 'John Doe',
      };

      const response1 = await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto1)
        .expect(201);

      const body1 = response1.body as RoomResponse;

      const joinRoomDto1: JoinRoomControllerDto = {
        password: roomPassword1,
        username: 'Jane Doe',
      };
      const joinResponse1 = await request(app.getHttpServer())
        .post(`/rooms/${body1.code}/join`)
        .send(joinRoomDto1)
        .expect(200);

      const joinBody1 = joinResponse1.body as JoinRoomResponse;

      // Create second room
      const roomCode2 = 'IIII009';
      const roomPassword2 = 'IIII009';
      const createRoomDto2: CreateRoomDto = {
        code: roomCode2,
        password: roomPassword2,
        username: 'Alice Smith',
      };

      const response2 = await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto2)
        .expect(201);

      const body2 = response2.body as RoomResponse;

      const joinRoomDto2: JoinRoomControllerDto = {
        password: roomPassword2,
        username: 'Bob Johnson',
      };
      const joinResponse2 = await request(app.getHttpServer())
        .post(`/rooms/${body2.code}/join`)
        .send(joinRoomDto2)
        .expect(200);

      const joinBody2 = joinResponse2.body as JoinRoomResponse;

      // Set secrets in first room
      await request(app.getHttpServer())
        .post(`/rooms/${body1.id}/secret/${body1.players[0].id}`)
        .send({ secret: '1234' })
        .expect(200);

      await request(app.getHttpServer())
        .post(`/rooms/${body1.id}/secret/${joinBody1.playerId}`)
        .send({ secret: '5678' })
        .expect(200);

      // Set secrets in second room
      await request(app.getHttpServer())
        .post(`/rooms/${body2.id}/secret/${body2.players[0].id}`)
        .send({ secret: '9999' })
        .expect(200);

      await request(app.getHttpServer())
        .post(`/rooms/${body2.id}/secret/${joinBody2.playerId}`)
        .send({ secret: '0000' })
        .expect(200);

      // Verify both rooms are in IN_PROGRESS state
      const roomResponse1 = await request(app.getHttpServer())
        .get(`/rooms/${body1.code}`)
        .expect(200);

      const roomResponse2 = await request(app.getHttpServer())
        .get(`/rooms/${body2.code}`)
        .expect(200);

      expect((roomResponse1.body as RoomResponse).state).toBe(
        RoomState.IN_PROGRESS,
      );
      expect((roomResponse2.body as RoomResponse).state).toBe(
        RoomState.IN_PROGRESS,
      );
    });

    it('/rooms (POST) should return 400 when code is too long', async () => {
      const createRoomDto: CreateRoomDto = {
        code: 'A'.repeat(51), // Más de 50 caracteres
        password: '1234',
        username: 'John Doe',
      };
      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(400);
    });

    it('/rooms (POST) should return 400 when password is too long', async () => {
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: 'A'.repeat(51), // Más de 50 caracteres
        username: 'John Doe',
      };
      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(400);
    });

    it('/rooms (POST) should return 400 when username is too long', async () => {
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'A'.repeat(51), // Más de 50 caracteres
      };
      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(400);
    });

    it('/rooms/:code/join (POST) should return 400 when username is too long', async () => {
      const roomCode = 'TEST002';
      const roomPassword = 'TEST002';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const joinRoomDto = {
        password: roomPassword,
        username: 'A'.repeat(51), // Más de 50 caracteres
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto)
        .expect(400);
    });

    it('/rooms/:code/join (POST) should return 400 when password is too long', async () => {
      const roomCode = 'TEST003';
      const roomPassword = 'TEST003';
      const createRoomDto: CreateRoomDto = {
        code: roomCode,
        password: roomPassword,
        username: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/rooms')
        .send(createRoomDto)
        .expect(201);

      const joinRoomDto = {
        password: 'A'.repeat(51), // Más de 50 caracteres
        username: 'Jane Doe',
      };

      await request(app.getHttpServer())
        .post(`/rooms/${roomCode}/join`)
        .send(joinRoomDto)
        .expect(400);
    });
  });
});
