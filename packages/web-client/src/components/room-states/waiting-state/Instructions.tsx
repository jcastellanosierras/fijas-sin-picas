import React from 'react';

import { Card } from '@/components/ui/Card';
import type { Room } from '@/types/rooms';

interface InstructionsProps {
  room: Room;
}

export const Instructions: React.FC<InstructionsProps> = ({ room }) => {
  return (
    <Card>
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 mb-2">📋 Instrucciones</h3>
        <p className="text-sm text-gray-600">
          Comparte el código <span className="font-mono font-semibold">{room.code}</span> con tu oponente para que pueda unirse a la sala. El juego comenzará automáticamente cuando ambos jugadores estén listos.
        </p>
      </div>
    </Card>
  );
};
