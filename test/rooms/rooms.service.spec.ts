import { RoomState } from '@/rooms/entities/room.entity';
import { RoomsService } from '@/rooms/rooms.service';
import { CreateRoomDto } from '@/rooms/dto/create-room.dto';
import { JoinRoomServiceDto } from '@/rooms/dto/join-room.service.dto';

describe('RoomsService', () => {
  let roomsService: RoomsService;

  beforeEach(() => {
    roomsService = new RoomsService();
  });

  it('should be defined', () => {
    expect(roomsService).toBeDefined();
  });

  it('should create a room', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '123456',
      password: '123456',
      username: 'John Doe',
    };
    const room = await roomsService.create(createRoomDto);
    expect(room).toBeDefined();
  });

  it('the initial state of the room should be waiting', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '123456',
      password: '123456',
      username: 'John Doe',
    };
    const room = await roomsService.create(createRoomDto);
    expect(room.state).toBe(RoomState.WAITING);
  });

  it('should not create a room with the same code', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '123456',
      password: '123456',
      username: 'John Doe',
    };
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
      username: 'John Doe',
    };
    const createRoomDto2: CreateRoomDto = {
      code: '123457',
      password: '123457',
      username: 'John Doe',
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
    const createRoomDto: CreateRoomDto = {
      code: '123456',
      password: '123456',
      username: 'John Doe',
    };
    const room = await roomsService.create(createRoomDto);
    const roomFound = await roomsService.getRoomByCode('123456');
    expect(roomFound).toBeDefined();
    expect(roomFound).toEqual(room);
  });

  it('mayus and minus should be the different rooms', async () => {
    const createRoomDtoMayus: CreateRoomDto = {
      code: '123456A',
      password: '123456',
      username: 'John Doe',
    };
    const createRoomDtoMinus: CreateRoomDto = {
      code: '123456a',
      password: '123456',
      username: 'John Doe',
    };
    const roomMayus = await roomsService.create(createRoomDtoMayus);
    const roomMinus = await roomsService.create(createRoomDtoMinus);
    const rooms = await roomsService.getRooms();
    expect(rooms).toHaveLength(2);
    expect(rooms).toContain(roomMayus);
    expect(rooms).toContain(roomMinus);
  });

  it('should return the room with the player that created the room', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '1234',
      password: '1234',
      username: 'John Doe',
    };
    const room = await roomsService.create(createRoomDto);
    const roomFound = await roomsService.getRoomByCode(room.code);
    expect(roomFound).toBeDefined();
    expect(roomFound.players).toHaveLength(1);
    expect(roomFound.players[0]?.username).toBe('John Doe');
  });

  // join room
  it('should join a room', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '1234',
      password: '1234',
      username: 'John Doe',
    };
    const room = await roomsService.create(createRoomDto);

    const joinRoomDto: JoinRoomServiceDto = {
      code: room.code,
      password: room.password,
      username: 'John Doe 2',
    };

    const roomJoined = await roomsService.joinRoom(joinRoomDto);

    expect(roomJoined).toBeDefined();
    expect(roomJoined.state).toBe(RoomState.WAITING);
  });

  it('should not join a room with the wrong code', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '1234',
      password: '1234',
      username: 'John Doe',
    };
    const room = await roomsService.create(createRoomDto);
    const joinRoomDto: JoinRoomServiceDto = {
      code: 'wrong-code',
      password: room.password,
      username: 'John Doe',
    };
    await expect(roomsService.joinRoom(joinRoomDto)).rejects.toThrow(
      'Room with code wrong-code not found',
    );
  });

  it('should not join a room with the wrong password', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '1234',
      password: '1234',
      username: 'John Doe',
    };
    const room = await roomsService.create(createRoomDto);
    const joinRoomDto: JoinRoomServiceDto = {
      code: room.code,
      password: 'wrong-password',
      username: 'John Doe',
    };
    await expect(roomsService.joinRoom(joinRoomDto)).rejects.toThrow(
      'Invalid password',
    );
  });

  it('should throw an error if user try to join with the same username that the host', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '1234',
      password: '1234',
      username: 'John Doe',
    };
    const room = await roomsService.create(createRoomDto);
    const joinRoomDto: JoinRoomServiceDto = {
      code: room.code,
      password: room.password,
      username: 'John Doe',
    };
    await expect(roomsService.joinRoom(joinRoomDto)).rejects.toThrow(
      'Username already exists',
    );
  });

  it('should throw an error if the room is full', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '1234',
      password: '1234',
      username: 'John Doe',
    };
    const room = await roomsService.create(createRoomDto);
    const joinRoomDto: JoinRoomServiceDto = {
      code: room.code,
      password: room.password,
      username: 'John Doe 2',
    };
    await roomsService.joinRoom(joinRoomDto);
    await expect(roomsService.joinRoom(joinRoomDto)).rejects.toThrow(
      'Room is full',
    );
  });

  it('should handle case sensitive usernames correctly', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '1234',
      password: '1234',
      username: 'John',
    };
    const room = await roomsService.create(createRoomDto);

    const joinRoomDto: JoinRoomServiceDto = {
      code: room.code,
      password: room.password,
      username: 'john',
    };

    const result = await roomsService.joinRoom(joinRoomDto);
    expect(result.players).toHaveLength(2);
    expect(result.state).toBe(RoomState.WAITING);
  });

  it('should handle special characters in username', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '1234',
      password: '1234',
      username: 'Host',
    };
    const room = await roomsService.create(createRoomDto);

    const joinRoomDto: JoinRoomServiceDto = {
      code: room.code,
      password: room.password,
      username: 'Player@123!',
    };

    const result = await roomsService.joinRoom(joinRoomDto);
    expect(result.players[1].username).toBe('Player@123!');
    expect(result.state).toBe(RoomState.WAITING);
  });

  it('should maintain room data consistency after joining', async () => {
    const createRoomDto: CreateRoomDto = {
      code: '1234',
      password: '1234',
      username: 'Host',
    };
    const room = await roomsService.create(createRoomDto);

    const joinRoomDto: JoinRoomServiceDto = {
      code: room.code,
      password: room.password,
      username: 'Player2',
    };

    await roomsService.joinRoom(joinRoomDto);

    const updatedRoom = await roomsService.getRoomByCode(room.code);
    expect(updatedRoom.players).toHaveLength(2);
    expect(updatedRoom.code).toBe(room.code);
    expect(updatedRoom.password).toBe(room.password);
    expect(updatedRoom.state).toBe(RoomState.WAITING);
  });
});
