import React from 'react';
import { Check } from 'lucide-react';

import type { Room } from '@/types/rooms';

interface SecretConfirmedProps {
  room: Room;
  playerId: string;
}

export const SecretConfirmed: React.FC<SecretConfirmedProps> = ({ room, playerId }) => {
  const otherPlayer = room.players.find((p) => p?.id !== playerId);
  const otherHasSetSecret = otherPlayer?.secret !== undefined;

  return (
    <div className="text-center">
      <div className="bg-green-50 rounded-lg p-6 mb-4">
        <Check className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ¡Secreto Configurado!
        </h3>
        <p className="text-green-600">
          Ya estableciste tu número secreto. Esperando que{' '}
          {otherPlayer?.username} configure el suyo.
        </p>
      </div>

      {otherHasSetSecret && (
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-blue-800 font-medium">
            ¡Ambos jugadores están listos! El juego comenzará en
            breve...
          </p>
        </div>
      )}
    </div>
  );
};
