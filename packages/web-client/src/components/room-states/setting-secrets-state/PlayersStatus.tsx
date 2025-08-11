import React from 'react';
import { Check, Clock, Users } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import type { Room } from '@/types/rooms';

interface PlayersStatusProps {
  room: Room;
  playerId: string;
}

export const PlayersStatus: React.FC<PlayersStatusProps> = ({ room, playerId }) => {
  const currentPlayer = room.players.find((p) => p?.id === playerId);
  const otherPlayer = room.players.find((p) => p?.id !== playerId);

  const hasSetSecret = currentPlayer?.secret !== undefined;
  const otherHasSetSecret = otherPlayer?.secret !== undefined;

  return (
    <Card>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800 font-medium">
            Estado de Jugadores
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span className="font-medium">
              {currentPlayer?.username} (Tú)
            </span>
            <div className="flex items-center space-x-2">
              {hasSetSecret ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 text-sm font-medium">
                    Listo
                  </span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-600 text-sm font-medium">
                    Pendiente
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span className="font-medium">{otherPlayer?.username}</span>
            <div className="flex items-center space-x-2">
              {otherHasSetSecret ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 text-sm font-medium">
                    Listo
                  </span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-600 text-sm font-medium">
                    Pendiente
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
