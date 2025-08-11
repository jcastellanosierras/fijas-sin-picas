import React from 'react';
import { Trophy } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import type { Room } from '@/types/rooms';

interface WinnerCardProps {
  room: Room;
  winnerUsername: string;
  otherPlayerUsername: string;
  mySecret: string;
  otherPlayerSecret: string;
}

export const WinnerCard: React.FC<WinnerCardProps> = ({
  room,
  winnerUsername,
  otherPlayerUsername,
  mySecret,
  otherPlayerSecret,
}) => {
  return (
    <Card className="mb-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h2 className="text-2xl font-semibold text-gray-900">Ganador</h2>
          <Trophy className="h-8 w-8 text-yellow-500" />
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-4">
          <h3 className="text-3xl font-bold text-yellow-800 mb-2">
            {winnerUsername}
          </h3>
          <p className="text-yellow-600">
            Adivinó correctamente el número secreto en el turno #
            {room.currentTurn}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              Número Secreto de {otherPlayerUsername}
            </h4>
            <p className="text-3xl font-mono font-bold text-blue-900">
              {otherPlayerSecret}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">
              Tu Número Secreto
            </h4>
            <p className="text-3xl font-mono font-bold text-purple-900">
              {mySecret}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
