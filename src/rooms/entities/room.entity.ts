export enum RoomState {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

export class Room {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly password: string,
    public state: RoomState = RoomState.WAITING,
    public readonly createdAt: Date = new Date(),
  ) {}
}
