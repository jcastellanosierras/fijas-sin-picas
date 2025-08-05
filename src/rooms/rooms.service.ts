import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Player, Room, RoomState } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomServiceDto } from './dto/join-room.service.dto';
import { JoinRoomResponseDto } from './dto/join-room-response.dto';
import { SetSecretServiceDto } from './dto/set-secret.service.dto';

@Injectable()
export class RoomsService {
  private readonly rooms: Room[] = [];

  private static readonly ERROR_MESSAGES = {
    ROOM_CODE_EXISTS: 'Room with this code already exists',
    INVALID_PASSWORD: 'Invalid password',
    ROOM_FULL: 'Room is full',
    USERNAME_EXISTS: 'Username already exists',
    SECRET_ALREADY_SET: 'Secret is already set for this player',
    ROOM_NOT_FOUND_BY_CODE: (code: string) =>
      `Room with code ${code} not found`,
    ROOM_NOT_FOUND_BY_ID: (id: string) => `Room with id ${id} not found`,
    PLAYER_NOT_FOUND: (id: string) => `Player with id ${id} not found`,
    ROOM_NOT_IN_SETTING_SECRETS: 'Room is not in setting secrets state',
  } as const;

  constructor() {}

  // ===== PUBLIC METHODS =====

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    await Promise.resolve();
    this.validateRoomCodeUniqueness(createRoomDto.code);

    const room = this.createNewRoom(createRoomDto);
    this.rooms.push(room);
    return room;
  }

  async joinRoom(
    joinRoomDto: JoinRoomServiceDto,
  ): Promise<JoinRoomResponseDto> {
    await Promise.resolve();
    const room = await this.getRoomByCode(joinRoomDto.code);

    this.validateJoinRoomRequest(room, joinRoomDto);
    const newPlayer = this.addPlayerToRoom(room, joinRoomDto.username);
    this.updateRoomStateToSettingSecrets(room);

    return this.buildJoinRoomResponse(room, newPlayer.id);
  }

  async setSecret({
    roomId,
    playerId,
    secret,
  }: SetSecretServiceDto): Promise<void> {
    await Promise.resolve();

    this.validateSecret(secret);

    const room = await this.getRoomById(roomId);
    const player = await this.findPlayerInRoom(playerId, room);

    this.validateSecretSetting(room, player);
    this.setPlayerSecret(player, secret);
    this.checkAndUpdateGameState(room);
  }

  async getRooms(): Promise<Room[]> {
    await Promise.resolve();
    return this.rooms;
  }

  async getRoomByCode(code: string): Promise<Room> {
    await Promise.resolve();
    const room = this.rooms.find((room) => room.code === code);
    if (!room) {
      throw new NotFoundException(
        RoomsService.ERROR_MESSAGES.ROOM_NOT_FOUND_BY_CODE(code),
      );
    }
    return room;
  }

  // ===== PRIVATE METHODS =====

  private validateRoomCodeUniqueness(code: string): void {
    if (this.rooms.find((room) => room.code === code)) {
      throw new BadRequestException(
        RoomsService.ERROR_MESSAGES.ROOM_CODE_EXISTS,
      );
    }
  }

  private createNewRoom(createRoomDto: CreateRoomDto): Room {
    const id = crypto.randomUUID();
    const room = new Room(id, createRoomDto.code, createRoomDto.password);

    room.players[0] = {
      id: crypto.randomUUID(),
      username: createRoomDto.username,
    };

    return room;
  }

  private addPlayerToRoom(room: Room, username: string): Player {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      username,
    };

    room.players[1] = newPlayer;
    return newPlayer;
  }

  private updateRoomStateToSettingSecrets(room: Room): void {
    room.state = RoomState.SETTING_SECRETS;
  }

  private buildJoinRoomResponse(
    room: Room,
    playerId: string,
  ): JoinRoomResponseDto {
    return {
      playerId,
      roomId: room.id,
      code: room.code,
      state: room.state,
      players: room.players.filter((player) => player !== null),
    };
  }

  private validateSecretSetting(room: Room, player: Player): void {
    if (room.state !== RoomState.SETTING_SECRETS) {
      throw new BadRequestException(
        RoomsService.ERROR_MESSAGES.ROOM_NOT_IN_SETTING_SECRETS,
      );
    }

    if (player.secret) {
      throw new BadRequestException(
        RoomsService.ERROR_MESSAGES.SECRET_ALREADY_SET,
      );
    }
  }

  private setPlayerSecret(player: Player, secret: string): void {
    player.secret = secret;
  }

  private checkAndUpdateGameState(room: Room): void {
    if (room.players.every((player) => player?.secret)) {
      room.state = RoomState.IN_PROGRESS;
    }
  }

  private async getRoomById(id: string): Promise<Room> {
    await Promise.resolve();
    const room = this.rooms.find((room) => room.id === id);
    if (!room) {
      throw new NotFoundException(
        RoomsService.ERROR_MESSAGES.ROOM_NOT_FOUND_BY_ID(id),
      );
    }
    return room;
  }

  private async findPlayerInRoom(id: string, room: Room): Promise<Player> {
    await Promise.resolve();
    const player = room.players.find((player) => player?.id === id);
    if (!player) {
      throw new NotFoundException(
        RoomsService.ERROR_MESSAGES.PLAYER_NOT_FOUND(id),
      );
    }
    return player;
  }

  private validateJoinRoomRequest(
    room: Room,
    joinRoomDto: JoinRoomServiceDto,
  ): void {
    this.validateRoomPassword(room, joinRoomDto.password);
    this.validateRoomCapacity(room);
    this.validateUsernameUniqueness(room, joinRoomDto.username);
  }

  private validateRoomPassword(room: Room, password: string): void {
    if (room.password !== password) {
      throw new BadRequestException(
        RoomsService.ERROR_MESSAGES.INVALID_PASSWORD,
      );
    }
  }

  private validateRoomCapacity(room: Room): void {
    if (room.players[0] && room.players[1]) {
      throw new BadRequestException(RoomsService.ERROR_MESSAGES.ROOM_FULL);
    }
  }

  private validateUsernameUniqueness(room: Room, username: string): void {
    const hostPlayer = room.players[0];
    if (hostPlayer && hostPlayer.username === username) {
      throw new BadRequestException(
        RoomsService.ERROR_MESSAGES.USERNAME_EXISTS,
      );
    }
  }

  private validateSecret(secret: string): void {
    if (secret.length !== 4 || !/^\d+$/.test(secret)) {
      throw new BadRequestException('Secret must be exactly 4 numeric digits');
    }
  }
}
