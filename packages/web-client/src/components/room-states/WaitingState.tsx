import React from 'react';
import type { Room } from '@/types/rooms';

interface WaitingStateProps {
  room: Room;
}

export const WaitingState: React.FC<WaitingStateProps> = ({ room }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Esperando jugadores</h1>
        <p className="text-lg mb-6">
          Código de la sala:{' '}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            {room.code}
          </span>
        </p>
        <p className="text-gray-600">
          Comparte este código con otros jugadores para que se unan a la sala.
        </p>
      </div>
    </div>
  );
};
