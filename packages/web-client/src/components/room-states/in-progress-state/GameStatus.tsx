import React from 'react';
import { Clock, Target, User } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import type { Room } from '@/types/rooms';

interface GameStatusProps {
  room: Room;
  isMyTurn: boolean;
  otherPlayerUsername: string;
}

export const GameStatus: React.FC<GameStatusProps> = ({ 
  room, 
  isMyTurn, 
  otherPlayerUsername 
}) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card>
        <div className="text-center">
          <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Turno Actual</p>
          <p className="text-lg font-semibold text-gray-900">#{room.currentTurn}</p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <User className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Turno de</p>
          <p className="text-lg font-semibold text-gray-900">
            {isMyTurn ? 'TÚ' : otherPlayerUsername || 'Oponente'}
          </p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Objetivo</p>
          <p className="text-lg font-semibold text-gray-900">4 Fijas</p>
        </div>
      </Card>
    </div>
  );
};
