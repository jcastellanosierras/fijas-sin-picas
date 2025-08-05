import { RoomState } from '@/rooms/entities/room.entity';
import { RoomsService } from '@/rooms/rooms.service';
import { CreateRoomDto } from '@/rooms/dto/create-room.dto';
import { JoinRoomServiceDto } from '@/rooms/dto/join-room.service.dto';

describe('RoomsService', () => {
  let roomsService: RoomsService;

  beforeEach(() => {
    roomsService = new RoomsService();
  });

  describe('Create room', () => {
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

    it('should be able to create more than one room', async () => {
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

    it('should be able to get a room by code', async () => {
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

    it('should treat uppercase and lowercase codes as different rooms', async () => {
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
      expect(roomFound.players).toHaveLength(2);
      expect(roomFound.players[0]?.username).toBe('John Doe');
      expect(roomFound.players[1]).toBeNull();
    });
  });

  describe('Join room', () => {
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
      expect(roomJoined.state).toBe(RoomState.SETTING_SECRETS);
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
      expect(result.state).toBe(RoomState.SETTING_SECRETS);
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
      expect(result.state).toBe(RoomState.SETTING_SECRETS);
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
      expect(updatedRoom.state).toBe(RoomState.SETTING_SECRETS);
    });
  });

  describe('Set secrets', () => {
    it('should set secret for a player', async () => {
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
      const joinResult = await roomsService.joinRoom(joinRoomDto);

      const playerId = joinResult.playerId;
      const secret = '1234';

      await roomsService.setSecret({
        roomId: room.id,
        playerId,
        secret,
      });

      const updatedRoom = await roomsService.getRoomByCode(room.code);
      const player = updatedRoom.players.find((p) => p?.id === playerId);
      expect(player?.secret).toBe(secret);
    });

    it('should change state to SECRETS_PENDING when a player joins', async () => {
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
      expect(updatedRoom.state).toBe(RoomState.SETTING_SECRETS);
    });

    it('should change state to IN_PROGRESS when both players set their secrets', async () => {
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
      const joinResult = await roomsService.joinRoom(joinRoomDto);

      // Establecer secreto del primer jugador
      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      });

      // Establecer secreto del segundo jugador
      await roomsService.setSecret({
        roomId: room.id,
        playerId: joinResult.playerId,
        secret: '5678',
      });

      const updatedRoom = await roomsService.getRoomByCode(room.code);
      expect(updatedRoom.state).toBe(RoomState.IN_PROGRESS);
    });

    it('should throw error when trying to set secret in non-existent room', async () => {
      await expect(
        roomsService.setSecret({
          roomId: 'non-existent-room-id',
          playerId: 'player-id',
          secret: '1234',
        }),
      ).rejects.toThrow('Room with id non-existent-room-id not found');
    });

    it('should throw error when trying to set secret for non-existent player', async () => {
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Host',
      };
      const room = await roomsService.create(createRoomDto);

      await expect(
        roomsService.setSecret({
          roomId: room.id,
          playerId: 'non-existent-player-id',
          secret: '1234',
        }),
      ).rejects.toThrow('Player with id non-existent-player-id not found');
    });

    it('should throw error when trying to set secret in room not in SETTING_SECRETS state', async () => {
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Host',
      };
      const room = await roomsService.create(createRoomDto);

      await expect(
        roomsService.setSecret({
          roomId: room.id,
          playerId: room.players[0]!.id,
          secret: '1234',
        }),
      ).rejects.toThrow('Room is not in setting secrets state');
    });

    it('should not allow updating secret once it is already set', async () => {
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
      const joinResult = await roomsService.joinRoom(joinRoomDto);

      // Establecer secreto inicial
      await roomsService.setSecret({
        roomId: room.id,
        playerId: joinResult.playerId,
        secret: '1234',
      });

      // Intentar actualizar secreto (debería fallar)
      await expect(
        roomsService.setSecret({
          roomId: room.id,
          playerId: joinResult.playerId,
          secret: '5678',
        }),
      ).rejects.toThrow('Secret is already set for this player');
    });

    it('should validate that secret has exactly 4 numeric digits', async () => {
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
      const joinResult = await roomsService.joinRoom(joinRoomDto);

      await expect(
        roomsService.setSecret({
          roomId: room.id,
          playerId: joinResult.playerId,
          secret: '123',
        }),
      ).rejects.toThrow('Secret must be exactly 4 numeric digits');

      // Test secreto con más de 4 dígitos
      await expect(
        roomsService.setSecret({
          roomId: room.id,
          playerId: joinResult.playerId,
          secret: '12345',
        }),
      ).rejects.toThrow('Secret must be exactly 4 numeric digits');

      // Test secreto con caracteres no numéricos
      await expect(
        roomsService.setSecret({
          roomId: room.id,
          playerId: joinResult.playerId,
          secret: '12a4',
        }),
      ).rejects.toThrow('Secret must be exactly 4 numeric digits');

      // Test secreto válido (debería pasar)
      await expect(
        roomsService.setSecret({
          roomId: room.id,
          playerId: joinResult.playerId,
          secret: '1234',
        }),
      ).resolves.toBeUndefined();
    });
  });
});
