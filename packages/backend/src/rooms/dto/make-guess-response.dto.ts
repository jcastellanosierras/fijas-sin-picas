import { Player, RoomState } from '@/rooms/entities/room.entity';

export interface RivalInfo {
  id: string;
  username: string;
}

export class MakeGuessResponseDto {
  id: string;
  guess: string;
  guessId: string;
  exactMatches: number;
  nextTurnPlayer: RivalInfo;
  currentTurn: number;
  state: RoomState;
  winner?: Player;
}
