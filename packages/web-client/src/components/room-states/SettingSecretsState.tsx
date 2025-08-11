import React from 'react';
import type { Room } from '@/types/rooms';

interface SettingSecretsStateProps {
  room: Room;
}

export const SettingSecretsState: React.FC<SettingSecretsStateProps> = ({
  room,
}) => {
  console.log(room);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Configurando secretos</h1>
        <p className="text-lg mb-6">
          Los jugadores están configurando sus números secretos.
        </p>
        <p className="text-gray-600">
          Espera mientras todos configuran sus secretos para comenzar el juego.
        </p>
      </div>
    </div>
  );
};
