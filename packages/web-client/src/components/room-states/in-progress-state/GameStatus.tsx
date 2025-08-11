import { Clock, Target, User } from 'lucide-react';

import type { Room } from '@/types/rooms';

interface GameStatusProps {
  room: Room;
  isMyTurn: boolean;
  otherPlayerUsername: string;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  room,
  isMyTurn,
  otherPlayerUsername,
}) => {
  return (
    <div className="mb-3 md:mb-4">
      <div className="flex justify-center space-x-3 md:space-x-5 text-xs md:text-sm">
        <div className="flex items-center space-x-1 md:space-x-2 text-gray-700">
          <Clock className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
          <span>Turno #{room.currentTurn}</span>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2 text-gray-700">
          <User className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
          <span>
            {isMyTurn ? 'Tu turno' : `Turno de ${otherPlayerUsername}`}
          </span>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2 text-gray-700">
          <Target className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
          <span>4 Fijas</span>
        </div>
      </div>
    </div>
  );
};
