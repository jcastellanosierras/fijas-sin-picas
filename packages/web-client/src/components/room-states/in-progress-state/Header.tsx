import React from 'react';
import { Play } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="text-center mb-4 md:mb-6">
      <div className="bg-blue-100 rounded-full p-2 md:p-3 w-10 h-10 md:w-14 md:h-14 mx-auto mb-2 md:mb-3 flex items-center justify-center">
        <Play className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
      </div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">¡Juego en Progreso!</h1>
      <p className="text-xs md:text-sm text-gray-600">Adivina el número secreto de tu oponente</p>
    </div>
  );
};
