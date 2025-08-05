export enum RoomState {
  WAITING = 'waiting',
  SETTING_SECRETS = 'setting_secrets',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

interface Player {
  id: string;
  username: string;
  secret?: string;
}

export class Room {
  public readonly id: string;
  public readonly code: string;
  public readonly password: string;
  public state: RoomState = RoomState.WAITING;
  public players: [Player | null, Player | null] = [null, null];
  public currentTurn: Player['id'] | null = null;
  public winner?: Player['id'];
  public readonly createdAt: Date = new Date();

  constructor(id: string, code: string, password: string) {
    this.id = id;
    this.code = code;
    this.password = password;
  }
}
