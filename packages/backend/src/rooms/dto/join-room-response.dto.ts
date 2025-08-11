import { RoomState } from '../entities/room.entity';

export class PlayerInfoDto {
  id: string;
  username: string;
}

export class JoinRoomResponseDto {
  playerId: string;
  roomId: string;
  code: string;
  state: RoomState;
  players: PlayerInfoDto[];
}
