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

  it('/rooms (POST) should create a room and return the 201', async () => {
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
      extraField: 'should not be allowed',
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

  // join room
  it('/rooms/:code/join (POST) should join a room and return the 200', async () => {
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

    const joinBody = joinResponse.body as RoomResponse;

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
});
