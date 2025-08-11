import React from 'react';
import { Play } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <Play className="h-8 w-8 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Juego en Progreso!</h1>
      <p className="text-gray-600">Adivina el número secreto de tu oponente</p>
    </div>
  );
};
