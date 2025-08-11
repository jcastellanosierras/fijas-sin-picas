import React from 'react';
import type { Room } from '@/types/rooms';

interface FinishedStateProps {
  room: Room;
}

export const FinishedState: React.FC<FinishedStateProps> = ({ room }) => {
  console.log(room);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Juego terminado</h1>
        <p className="text-lg mb-6">
          El juego ha finalizado. ¡Gracias por jugar!
        </p>
        <p className="text-gray-600">
          Revisa los resultados y crea una nueva sala si quieres jugar de nuevo.
        </p>
      </div>
    </div>
  );
};
