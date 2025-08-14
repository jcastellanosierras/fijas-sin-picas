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

  describe('Make guess', () => {
    it('should throw error if room does not exist', async () => {
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

      await expect(
        roomsService.makeGuess({
          roomId: 'non-existent-room-id',
          playerId: 'non-existent-player-id',
          guess: '123',
        }),
      ).rejects.toThrow('Room with id non-existent-room-id not found');
    });

    it('should throw error if player does not exist', async () => {
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Host',
      };
      const room = await roomsService.create(createRoomDto);

      await expect(
        roomsService.makeGuess({
          roomId: room.id,
          playerId: 'non-existent-player-id',
          guess: '1234',
        }),
      ).rejects.toThrow('Player with id non-existent-player-id not found');
    });

    it('should throw error if room is not in progress', async () => {
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Host',
      };
      const room = await roomsService.create(createRoomDto);

      await expect(
        roomsService.makeGuess({
          roomId: room.id,
          playerId: room.players[0]!.id,
          guess: '1234',
        }),
      ).rejects.toThrow('Room is not in progress');
    });

    it('should throw error if guess is not 4 numeric digits', async () => {
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

      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      });

      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      });

      const updatedRoom = await roomsService.getRoomByCode(room.code);
      const turnPlayerId = updatedRoom.currentTurnPlayerId;

      await expect(
        roomsService.makeGuess({
          roomId: room.id,
          playerId: turnPlayerId!,
          guess: '123',
        }),
      ).rejects.toThrow('Guess must be exactly 4 numeric digits');
    });

    it('should throw error if player is not the current turn player', async () => {
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

      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      });

      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      });

      const updatedRoom = await roomsService.getRoomByCode(room.code);
      const turnPlayerId = updatedRoom.currentTurnPlayerId;
      const playerId =
        turnPlayerId === room.players[0]!.id
          ? room.players[1]!.id
          : room.players[0]!.id;

      await expect(
        roomsService.makeGuess({
          roomId: room.id,
          playerId: playerId,
          guess: '1234',
        }),
      ).rejects.toThrow('Player is not the current turn player');
    });

    it('should return the result of the guess', async () => {
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

      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      });

      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      });

      const updatedRoom = await roomsService.getRoomByCode(room.code);
      const turnPlayerId = updatedRoom.currentTurnPlayerId;

      const guess = '1235';

      const result = await roomsService.makeGuess({
        roomId: room.id,
        playerId: turnPlayerId!,
        guess,
      });

      expect(result.id).toBeDefined();
      expect(result.guess).toBe(guess);

      expect(typeof result.exactMatches).toBe('number');
      expect(result.exactMatches).toBeGreaterThanOrEqual(0);
      expect(result.exactMatches).toBeLessThanOrEqual(4);

      const otherPlayer = updatedRoom.players.find(
        (p) => p!.id !== turnPlayerId,
      )!;
      expect(result.nextTurnPlayer).toBeDefined();
      expect(result.nextTurnPlayer.id).toBe(otherPlayer.id);

      expect(Number.isInteger(result.currentTurn)).toBe(true);

      expect([RoomState.IN_PROGRESS, RoomState.FINISHED]).toContain(
        result.state,
      );

      if (result.state === RoomState.FINISHED) {
        expect(result.winner).toBeDefined();
        expect(result.winner!.id).toBeDefined();
      } else {
        expect(result.winner).toBeUndefined();
      }
    });

    it('should finish game when player guesses correctly', async () => {
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

      // Host establece secreto '1234'
      const player1SetSecretData = {
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      };
      await roomsService.setSecret(player1SetSecretData);

      // Player2 establece secreto '5678'
      const player2SetSecretData = {
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      };
      await roomsService.setSecret(player2SetSecretData);

      const updatedRoom = await roomsService.getRoomByCode(room.code);
      const turnPlayerId = updatedRoom.currentTurnPlayerId;

      let guess: string;
      if (turnPlayerId !== room.players[0]!.id) {
        guess = '1234';
      } else {
        guess = '5678';
      }
      const result = await roomsService.makeGuess({
        roomId: room.id,
        playerId: turnPlayerId!,
        guess,
      });

      expect(result.state).toBe(RoomState.FINISHED);
      expect(result.winner).toBeDefined();
      expect(result.winner!.id).toBe(turnPlayerId);
      expect(result.exactMatches).toBe(4);
    });

    it('should continue game when player guesses incorrectly', async () => {
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

      // Host establece secreto '1234'
      const player1SetSecretData = {
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      };
      await roomsService.setSecret(player1SetSecretData);

      // Player2 establece secreto '5678'
      const player2SetSecretData = {
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      };
      await roomsService.setSecret(player2SetSecretData);

      const updatedRoom = await roomsService.getRoomByCode(room.code);
      const turnPlayerId = updatedRoom.currentTurnPlayerId;

      let guess: string;
      if (turnPlayerId !== room.players[0]!.id) {
        guess = '9299';
      } else {
        guess = '9699';
      }
      // Player2 adivina su propio secreto incorrectamente
      const result = await roomsService.makeGuess({
        roomId: room.id,
        playerId: turnPlayerId!,
        guess,
      });

      const expectedNextTurnPlayerId =
        turnPlayerId === room.players[0]!.id
          ? room.players[1]!.id
          : room.players[0]!.id;
      expect(result.state).toBe(RoomState.IN_PROGRESS);
      expect(result.winner).toBeUndefined();
      expect(result.exactMatches).toBe(1);
      expect(result.nextTurnPlayer).toBeDefined();
      expect(result.nextTurnPlayer.id).toBe(expectedNextTurnPlayerId);
    });

    it('should handle partial matches correctly', async () => {
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

      // Host establece secreto '1234'
      const player1SetSecretData = {
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      };
      await roomsService.setSecret(player1SetSecretData);

      // Player2 establece secreto '5678'
      const player2SetSecretData = {
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      };
      await roomsService.setSecret(player2SetSecretData);

      const updatedRoom = await roomsService.getRoomByCode(room.code);
      const turnPlayerId = updatedRoom.currentTurnPlayerId;

      let guess: string;
      if (turnPlayerId !== room.players[0]!.id) {
        guess = '1239';
      } else {
        guess = '5679';
      }
      // Player2 adivina su propio secreto con 2 coincidencias exactas
      const result = await roomsService.makeGuess({
        roomId: room.id,
        playerId: turnPlayerId!,
        guess,
      });

      const expectedNextTurnPlayerId =
        turnPlayerId === room.players[0]!.id
          ? room.players[1]!.id
          : room.players[0]!.id;
      expect(result.state).toBe(RoomState.IN_PROGRESS);
      expect(result.winner).toBeUndefined();
      expect(result.exactMatches).toBe(3);
      expect(result.nextTurnPlayer).toBeDefined();
      expect(result.nextTurnPlayer.id).toBe(expectedNextTurnPlayerId);
    });

    it('should handle no matches correctly', async () => {
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

      // Host establece secreto '1234'
      const player1SetSecretData = {
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      };
      await roomsService.setSecret(player1SetSecretData);

      // Player2 establece secreto '5678'
      const player2SetSecretData = {
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      };
      await roomsService.setSecret(player2SetSecretData);

      const updatedRoom = await roomsService.getRoomByCode(room.code);
      const turnPlayerId = updatedRoom.currentTurnPlayerId;

      let guess: string;
      if (turnPlayerId !== room.players[0]!.id) {
        guess = '9999';
      } else {
        guess = '9999';
      }
      // Player2 adivina su propio secreto sin coincidencias
      const expectedNextTurnPlayerId =
        turnPlayerId === room.players[0]!.id
          ? room.players[1]!.id
          : room.players[0]!.id;
      // Player2 adivina su propio secreto sin coincidencias
      const result = await roomsService.makeGuess({
        roomId: room.id,
        playerId: turnPlayerId!,
        guess,
      });

      expect(result.state).toBe(RoomState.IN_PROGRESS);
      expect(result.winner).toBeUndefined();
      expect(result.exactMatches).toBe(0);
      expect(result.nextTurnPlayer).toBeDefined();
      expect(result.nextTurnPlayer.id).toBe(expectedNextTurnPlayerId);
    });

    it('should handle multiple turns correctly', async () => {
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

      const player1SetSecretData = {
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      };
      await roomsService.setSecret(player1SetSecretData);

      const player2SetSecretData = {
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      };
      await roomsService.setSecret(player2SetSecretData);

      const updatedRoom = await roomsService.getRoomByCode(room.code);
      const turnPlayerId = updatedRoom.currentTurnPlayerId;

      let guess: string;
      if (turnPlayerId !== room.players[0]!.id) {
        guess = '1111';
      } else {
        guess = '5555';
      }

      const result1 = await roomsService.makeGuess({
        roomId: room.id,
        playerId: turnPlayerId!,
        guess,
      });

      const expectedNextTurnPlayerId =
        turnPlayerId === room.players[0]!.id
          ? room.players[1]!.id
          : room.players[0]!.id;

      expect(result1.state).toBe(RoomState.IN_PROGRESS);
      expect(result1.winner).toBeUndefined();
      expect(result1.exactMatches).toBe(1);
      expect(result1.nextTurnPlayer).toBeDefined();
      expect(result1.nextTurnPlayer.id).toBe(expectedNextTurnPlayerId);
      expect(result1.currentTurn).toBe(1);

      let guess2: string;
      if (expectedNextTurnPlayerId === room.players[0]!.id) {
        guess2 = '6666';
      } else {
        guess2 = '2222';
      }
      const result2 = await roomsService.makeGuess({
        roomId: room.id,
        playerId: expectedNextTurnPlayerId,
        guess: guess2,
      });

      const expectedNextTurnPlayerId2 =
        expectedNextTurnPlayerId === room.players[0]!.id
          ? room.players[1]!.id
          : room.players[0]!.id;

      expect(result2.state).toBe(RoomState.IN_PROGRESS);
      expect(result2.winner).toBeUndefined();
      expect(result2.exactMatches).toBe(1);
      expect(result2.nextTurnPlayer).toBeDefined();
      expect(result2.nextTurnPlayer.id).toBe(expectedNextTurnPlayerId2);
      expect(result2.currentTurn).toBe(2);

      let guess3: string;
      if (expectedNextTurnPlayerId2 === room.players[0]!.id) {
        guess3 = '6666';
      } else {
        guess3 = '2222';
      }
      const result3 = await roomsService.makeGuess({
        roomId: room.id,
        playerId: expectedNextTurnPlayerId2,
        guess: guess3,
      });

      const expectedNextTurnPlayerId3 =
        expectedNextTurnPlayerId2 === room.players[0]!.id
          ? room.players[1]!.id
          : room.players[0]!.id;

      expect(result3.state).toBe(RoomState.IN_PROGRESS);
      expect(result3.winner).toBeUndefined();
      expect(result3.exactMatches).toBe(1);
      expect(result3.nextTurnPlayer).toBeDefined();
      expect(result3.nextTurnPlayer.id).toBe(expectedNextTurnPlayerId3);
      expect(result3.currentTurn).toBe(2);

      let guess4: string;
      if (expectedNextTurnPlayerId3 === room.players[0]!.id) {
        guess4 = '6666';
      } else {
        guess4 = '2222';
      }
      const result4 = await roomsService.makeGuess({
        roomId: room.id,
        playerId: expectedNextTurnPlayerId3,
        guess: guess4,
      });

      const expectedNextTurnPlayerId4 =
        expectedNextTurnPlayerId3 === room.players[0]!.id
          ? room.players[1]!.id
          : room.players[0]!.id;

      expect(result4.state).toBe(RoomState.IN_PROGRESS);
      expect(result4.winner).toBeUndefined();
      expect(result4.exactMatches).toBe(1);
      expect(result4.nextTurnPlayer).toBeDefined();
      expect(result4.nextTurnPlayer.id).toBe(expectedNextTurnPlayerId4);
      expect(result4.currentTurn).toBe(3);
    });
  });

  describe('Delete stales', () => {
    beforeEach(async () => {
      // Limpiar todas las salas antes de cada test
      const rooms = await roomsService.getRooms();
      rooms.length = 0;

      // Configurar timers falsos para simular el paso del tiempo
      jest.useFakeTimers();
    });

    afterEach(() => {
      // Restaurar timers reales después de cada test
      jest.useRealTimers();
    });

    it('should delete rooms with FINISHED state', async () => {
      // Crear una sala
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Host',
      };
      const room = await roomsService.create(createRoomDto);

      // Unir al segundo jugador
      const joinRoomDto: JoinRoomServiceDto = {
        code: room.code,
        password: room.password,
        username: 'Player2',
      };
      await roomsService.joinRoom(joinRoomDto);

      // Establecer secretos
      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      });

      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      });

      // Hacer una adivinanza correcta para terminar el juego
      const updatedRoom = await roomsService.getRoomByCode(room.code);
      const turnPlayerId = updatedRoom.currentTurnPlayerId;

      let guess: string;
      if (turnPlayerId === room.players[0]!.id) {
        guess = '5678'; // Adivinar el secreto del oponente
      } else {
        guess = '1234'; // Adivinar el secreto del oponente
      }

      await roomsService.makeGuess({
        roomId: room.id,
        playerId: turnPlayerId!,
        guess,
      });

      // Verificar que el estado es FINISHED
      const finishedRoom = await roomsService.getRoomByCode(room.code);
      expect(finishedRoom.state).toBe(RoomState.FINISHED);

      // Ejecutar la función de borrar salas obsoletas
      await roomsService.deleteStales();

      // Verificar que la sala se ha borrado
      const remainingRooms = await roomsService.getRooms();
      expect(remainingRooms).toHaveLength(0);
    });

    it('should delete room with last activity 3 minutes ago (only created)', async () => {
      // Crear una sala
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Host',
      };
      await roomsService.create(createRoomDto);

      // Simular que han pasado 3 minutos
      jest.advanceTimersByTime(3 * 60 * 1000);

      // Ejecutar la función de borrar salas obsoletas
      await roomsService.deleteStales();

      // Verificar que la sala se ha borrado
      const remainingRooms = await roomsService.getRooms();
      expect(remainingRooms).toHaveLength(0);
    });

    it('should delete room with last activity 3 minutes ago (with second player)', async () => {
      // Crear una sala
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Host',
      };
      const room = await roomsService.create(createRoomDto);

      // Unir al segundo jugador
      const joinRoomDto: JoinRoomServiceDto = {
        code: room.code,
        password: room.password,
        username: 'Player2',
      };
      await roomsService.joinRoom(joinRoomDto);

      // Simular que han pasado 3 minutos desde la última actividad
      jest.advanceTimersByTime(3 * 60 * 1000);

      // Ejecutar la función de borrar salas obsoletas
      await roomsService.deleteStales();

      // Verificar que la sala se ha borrado
      const remainingRooms = await roomsService.getRooms();
      expect(remainingRooms).toHaveLength(0);
    });

    it('should delete room with last activity 3 minutes ago (with secrets set)', async () => {
      // Crear una sala
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Host',
      };
      const room = await roomsService.create(createRoomDto);

      // Unir al segundo jugador
      const joinRoomDto: JoinRoomServiceDto = {
        code: room.code,
        password: room.password,
        username: 'Player2',
      };
      await roomsService.joinRoom(joinRoomDto);

      // Establecer secretos
      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      });

      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      });

      // Simular que han pasado 3 minutos desde la última actividad
      jest.advanceTimersByTime(3 * 60 * 1000);

      // Ejecutar la función de borrar salas obsoletas
      await roomsService.deleteStales();

      // Verificar que la sala se ha borrado
      const remainingRooms = await roomsService.getRooms();
      expect(remainingRooms).toHaveLength(0);
    });

    it('should delete room with last activity 3 minutes ago (with guess made)', async () => {
      // Crear una sala
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Host',
      };
      const room = await roomsService.create(createRoomDto);

      // Unir al segundo jugador
      const joinRoomDto: JoinRoomServiceDto = {
        code: room.code,
        password: room.password,
        username: 'Player2',
      };
      await roomsService.joinRoom(joinRoomDto);

      // Establecer secretos
      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      });

      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      });

      // Hacer una adivinanza
      const updatedRoom = await roomsService.getRoomByCode(room.code);
      const turnPlayerId = updatedRoom.currentTurnPlayerId;

      const guess = '1111'; // Adivinanza incorrecta
      await roomsService.makeGuess({
        roomId: room.id,
        playerId: turnPlayerId!,
        guess,
      });

      // Simular que han pasado 3 minutos desde la última actividad
      jest.advanceTimersByTime(3 * 60 * 1000);

      // Ejecutar la función de borrar salas obsoletas
      await roomsService.deleteStales();

      // Verificar que la sala se ha borrado
      const remainingRooms = await roomsService.getRooms();
      expect(remainingRooms).toHaveLength(0);
    });

    it('should not delete rooms with recent activity', async () => {
      // Crear una sala
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Host',
      };
      const room = await roomsService.create(createRoomDto);

      // Simular que la última actividad fue hace 2 minutos (menos de 3)
      jest.advanceTimersByTime(2 * 60 * 1000);

      // Ejecutar la función de borrar salas obsoletas
      await roomsService.deleteStales();

      // Verificar que la sala NO se ha borrado
      const remainingRooms = await roomsService.getRooms();
      expect(remainingRooms).toHaveLength(1);
      expect(remainingRooms[0].id).toBe(room.id);
    });

    it('should not delete rooms in active state with recent activity', async () => {
      // Crear una sala
      const createRoomDto: CreateRoomDto = {
        code: '1234',
        password: '1234',
        username: 'Host',
      };
      const room = await roomsService.create(createRoomDto);

      // Unir al segundo jugador
      const joinRoomDto: JoinRoomServiceDto = {
        code: room.code,
        password: room.password,
        username: 'Player2',
      };
      await roomsService.joinRoom(joinRoomDto);

      // Establecer secretos para poner la sala en estado IN_PROGRESS
      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[0]!.id,
        secret: '1234',
      });

      await roomsService.setSecret({
        roomId: room.id,
        playerId: room.players[1]!.id,
        secret: '5678',
      });

      // Simular que la última actividad fue hace 2 minutos
      jest.advanceTimersByTime(2 * 60 * 1000);

      // Ejecutar la función de borrar salas obsoletas
      await roomsService.deleteStales();

      // Verificar que la sala NO se ha borrado
      const remainingRooms = await roomsService.getRooms();
      expect(remainingRooms).toHaveLength(1);
      expect(remainingRooms[0].id).toBe(room.id);
      expect(remainingRooms[0].state).toBe(RoomState.IN_PROGRESS);
    });
  });
});
