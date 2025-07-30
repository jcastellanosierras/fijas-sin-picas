import { RoomState } from '@/rooms/entities/room.entity';
import { RoomsService } from '@/rooms/rooms.service';
import { CreateRoomDto } from '@/rooms/dto/create-room.dto';

describe('RoomsService', () => {
  let roomsService: RoomsService;

  beforeEach(() => {
    roomsService = new RoomsService();
  });

  it('should be defined', () => {
    expect(roomsService).toBeDefined();
  });

  it('should create a room', async () => {
    const createRoomDto: CreateRoomDto = { code: '123456', password: '123456' };
    const room = await roomsService.create(createRoomDto);
    expect(room).toBeDefined();
  });

  it('the initial state of the room should be waiting', async () => {
    const createRoomDto: CreateRoomDto = { code: '123456', password: '123456' };
    const room = await roomsService.create(createRoomDto);
    expect(room.state).toBe(RoomState.WAITING);
  });

  it('should not create a room with the same code', async () => {
    const createRoomDto: CreateRoomDto = { code: '123456', password: '123456' };
    const room1 = await roomsService.create(createRoomDto);
    expect(room1.code).toBeDefined();
    await expect(roomsService.create(createRoomDto)).rejects.toThrow(
      'Room with this code already exists',
    );
  });

  it('should can create more than one room', async () => {
    const createRoomDto1: CreateRoomDto = {
      code: '123456',
      password: '123456',
    };
    const createRoomDto2: CreateRoomDto = {
      code: '123457',
      password: '123457',
    };
    const room1 = await roomsService.create(createRoomDto1);
    const room2 = await roomsService.create(createRoomDto2);
    const rooms = await roomsService.getRooms();
    expect(rooms).toHaveLength(2);
    expect(rooms).toContain(room1);
    expect(rooms).toContain(room2);
  });

  it('should not get a room by code if the room does not exist', async () => {
    await expect(roomsService.getRoomByCode('123456')).rejects.toThrow();
  });

  it('should can get a room by code', async () => {
    const createRoomDto: CreateRoomDto = { code: '123456', password: '123456' };
    const room = await roomsService.create(createRoomDto);
    const roomFound = await roomsService.getRoomByCode('123456');
    expect(roomFound).toBeDefined();
    expect(roomFound).toEqual(room);
  });

  it('mayus and minus should be the different rooms', async () => {
    const createRoomDtoMayus: CreateRoomDto = {
      code: '123456A',
      password: '123456',
    };
    const createRoomDtoMinus: CreateRoomDto = {
      code: '123456a',
      password: '123456',
    };
    const roomMayus = await roomsService.create(createRoomDtoMayus);
    const roomMinus = await roomsService.create(createRoomDtoMinus);
    const rooms = await roomsService.getRooms();
    expect(rooms).toHaveLength(2);
    expect(rooms).toContain(roomMayus);
    expect(rooms).toContain(roomMinus);
  });
});
