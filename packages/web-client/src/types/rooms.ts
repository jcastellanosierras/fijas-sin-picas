export enum RoomState {
  WAITING = 'waiting',
  SETTING_SECRETS = 'setting_secrets',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

export interface Player {
  id: string;
  username: string;
  secret?: string;
  guesses: Guess[];
}

export interface Guess {
  id: string;
  playerId: Player['id'];
  guess: string;
  result?: number;
  createdAt: Date;
}

export interface Room {
  id: string;
  code: string;
  password: string;
  state: RoomState;
  players: [Player | null, Player | null];
  currentTurn: number;
  currentTurnPlayerId: string | null;
  winner?: string;
  secrets?: [string, string];
  createdAt: string;
}

export interface CreateRoomDto {
  code: string;
  password: string;
  username: string;
}

export type JoinRoomDto = CreateRoomDto;

export type CreateRoomResponse = Room;

export interface PlayerInfo {
  id: string;
  username: string;
}

export interface JoinRoomResponse {
  playerId: string;
  roomId: string;
  code: string;
  state: RoomState;
  players: PlayerInfo[];
}

export interface MakeGuessDto {
  guess: string;
}

export interface RivalInfo {
  id: string;
  username: string;
}

export interface MakeGuessResponse {
  id: string;
  guess: string;
  guessId: string;
  exactMatches: number;
  nextTurnPlayer: RivalInfo;
  currentTurn: number;
  state: RoomState;
  winner?: Player;
}
