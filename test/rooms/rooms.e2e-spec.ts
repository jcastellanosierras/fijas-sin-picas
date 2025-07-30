import { CreateRoomDto, RoomsModule, RoomState } from '@/rooms';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

interface RoomResponse {
  id: string;
  code: string;
  state: RoomState;
}

describe('Rooms E22 Tests', () => {
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
});
