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

export class Room {
  public readonly id: string;
  public readonly code: string;
  public readonly password: string;
  public state: RoomState = RoomState.WAITING;
  public players: [Player | null, Player | null] = [null, null];
  public currentTurn: number = 0;
  public currentTurnPlayerId: Player['id'] | null = null;
  public winner?: Player['id'];
  public secrets?: [string, string];
  public readonly createdAt: Date = new Date();
  public latestActivityAt: Date = new Date();

  constructor(id: string, code: string, password: string) {
    this.id = id;
    this.code = code;
    this.password = password;
  }
}
