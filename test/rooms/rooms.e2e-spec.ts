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
      const roomCode = '1234567';
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
      expect(joinBody.state).toBe(RoomState.WAITING);
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
      const roomCode = '1234568';
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
      const roomCode = '1234569';
      const roomPassword = '1234569';
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
      const roomCode = '1234570';
      const roomPassword = '1234570';
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
});
