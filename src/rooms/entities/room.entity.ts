export enum RoomState {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

interface PlayerInfo {
  id: string;
  username: string;
}

export class Room {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly password: string,
    public state: RoomState = RoomState.WAITING,
    public players: [PlayerInfo?, PlayerInfo?] = [],
    public readonly createdAt: Date = new Date(),
  ) {}
}
