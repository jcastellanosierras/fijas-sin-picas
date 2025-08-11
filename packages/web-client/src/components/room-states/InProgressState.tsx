import React from 'react';
import type { Room } from '@/types/rooms';

interface InProgressStateProps {
  room: Room;
}

export const InProgressState: React.FC<InProgressStateProps> = ({ room }) => {
  console.log(room);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Juego en progreso</h1>
        <p className="text-lg mb-6">
          El juego está en marcha. ¡Haz tu mejor adivinanza!
        </p>
        <p className="text-gray-600">
          Intenta adivinar el número secreto del otro jugador.
        </p>
      </div>
    </div>
  );
};
