import React from 'react';

import { Card } from '@/components/ui/Card';

interface FinalMessageProps {
  isWinner: boolean;
}

export const FinalMessage: React.FC<FinalMessageProps> = ({ isWinner }) => {
  return (
    <div className="mt-8">
      <Card>
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">
            {isWinner ? '🏆 ¡Excelente estrategia!' : '👏 ¡Bien jugado!'}
          </h3>
          <p className="text-sm text-gray-600">
            {isWinner 
              ? 'Demostraste gran habilidad deductiva. ¡Desafía a tus amigos a una revancha!'
              : 'Fue un juego reñido. ¡La próxima vez será tu turno de ganar!'
            }
          </p>
        </div>
      </Card>
    </div>
  );
};
