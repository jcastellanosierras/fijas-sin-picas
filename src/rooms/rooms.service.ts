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
import { MakeGuessServiceDto } from './dto/make-guess.service.dto';
import { MakeGuessResponseDto } from './dto/make-guess-response.dto';

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
    ROOM_NOT_IN_PROGRESS: 'Room is not in progress',
    INVALID_GUESS: 'Guess must be exactly 4 numeric digits',
    PLAYER_NOT_CURRENT_TURN: 'Player is not the current turn player',
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
    this.checkAndStartGame(room);
  }

  async makeGuess(
    guessDto: MakeGuessServiceDto,
  ): Promise<MakeGuessResponseDto> {
    await Promise.resolve();

    const room = await this.getRoomById(guessDto.roomId);
    const player = await this.findPlayerInRoom(guessDto.playerId, room);

    this.validateGuessRequest(room, player);
    this.addGuessToPlayer(player, guessDto.guess);

    const guessResult = this.createGuessResult(guessDto.guess, room, player);
    const exactMatches = this.calculateExactMatches(
      guessDto.guess,
      this.getOpponentSecret(room, player),
    );

    guessResult.exactMatches = exactMatches;

    if (this.isWinningGuess(exactMatches)) {
      this.handleWinningGuess(guessResult, player, room);
    } else {
      this.handleNonWinningGuess(guessResult, room, player);
    }

    return guessResult;
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
      guesses: [],
    };

    return room;
  }

  private addPlayerToRoom(room: Room, username: string): Player {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      username,
      guesses: [],
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

  private checkAndStartGame(room: Room): void {
    if (room.players.every((player) => player?.secret)) {
      room.state = RoomState.IN_PROGRESS;
      const randomPlayerIndex = Math.round(Math.random()) as 0 | 1;
      room.currentTurnPlayerId = room.players[randomPlayerIndex]?.id ?? null;
      room.currentTurn = 1;
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

  private validateRoomStateOnMakeGuess(room: Room): void {
    if (room.state !== RoomState.IN_PROGRESS) {
      throw new BadRequestException(
        RoomsService.ERROR_MESSAGES.ROOM_NOT_IN_PROGRESS,
      );
    }
  }

  private validateGuess(guess: string): void {
    const regex = /^\d{4}$/;
    if (!regex.test(guess)) {
      throw new BadRequestException(RoomsService.ERROR_MESSAGES.INVALID_GUESS);
    }
  }

  private calculateExactMatches(guess: string, secret: string): number {
    return guess.split('').filter((digit, index) => digit === secret[index])
      .length;
  }

  private validateGuessRequest(room: Room, player: Player): void {
    this.validateRoomStateOnMakeGuess(room);
    this.validatePlayerTurn(room, player);
  }

  private validatePlayerTurn(room: Room, player: Player): void {
    if (player.id !== room.currentTurnPlayerId) {
      throw new BadRequestException(
        RoomsService.ERROR_MESSAGES.PLAYER_NOT_CURRENT_TURN,
      );
    }
  }

  private addGuessToPlayer(player: Player, guess: string): void {
    player.guesses.push({
      id: crypto.randomUUID(),
      playerId: player.id,
      guess,
      createdAt: new Date(),
    });
  }

  private createGuessResult(
    guess: string,
    room: Room,
    currentPlayer: Player,
  ): MakeGuessResponseDto {
    const nextPlayer = this.getNextPlayer(room, currentPlayer);

    return {
      id: crypto.randomUUID(),
      guess,
      exactMatches: 0,
      nextTurnPlayer: {
        id: nextPlayer.id,
        username: nextPlayer.username,
      },
      currentTurn: room.currentTurn,
      state: room.state,
    };
  }

  private getOpponentSecret(room: Room, currentPlayer: Player): string {
    const opponent = this.getNextPlayer(room, currentPlayer);
    return opponent.secret!;
  }

  private getNextPlayer(room: Room, currentPlayer: Player): Player {
    const opponent = room.players.find((p) => p?.id !== currentPlayer.id);
    if (!opponent) {
      throw new Error('Opponent not found');
    }
    return opponent;
  }

  private isWinningGuess(exactMatches: number): boolean {
    return exactMatches === 4;
  }

  private handleWinningGuess(
    guessResult: MakeGuessResponseDto,
    winner: Player,
    room: Room,
  ): void {
    guessResult.winner = winner;
    guessResult.state = RoomState.FINISHED;
    room.state = RoomState.FINISHED;
  }

  private handleNonWinningGuess(
    guessResult: MakeGuessResponseDto,
    room: Room,
    currentPlayer: Player,
  ): void {
    const nextPlayer = this.getNextPlayer(room, currentPlayer);
    this.updateTurnToNextPlayer(room, nextPlayer);

    guessResult.nextTurnPlayer = {
      id: nextPlayer.id,
      username: nextPlayer.username,
    };

    if (this.shouldIncrementTurn(room)) {
      this.incrementTurn(room);
      guessResult.currentTurn = room.currentTurn;
    }
  }

  private updateTurnToNextPlayer(room: Room, nextPlayer: Player): void {
    room.currentTurnPlayerId = nextPlayer.id;
  }

  private shouldIncrementTurn(room: Room): boolean {
    return room.players[0]?.guesses.length === room.players[1]?.guesses.length;
  }

  private incrementTurn(room: Room): void {
    room.currentTurn = room.currentTurn + 1;
  }
}
