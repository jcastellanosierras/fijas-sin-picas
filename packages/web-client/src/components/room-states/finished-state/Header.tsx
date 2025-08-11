import React from 'react';
import { Medal, Trophy } from 'lucide-react';

interface HeaderProps {
  isWinner: boolean;
  winnerUsername: string;
}

export const Header: React.FC<HeaderProps> = ({ isWinner, winnerUsername }) => {
  return (
    <div className="text-center mb-8">
      <div className={`${isWinner ? 'bg-yellow-100' : 'bg-gray-100'} rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
        {isWinner ? (
          <Trophy className="h-8 w-8 text-yellow-600" />
        ) : (
          <Medal className="h-8 w-8 text-gray-600" />
        )}
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        {isWinner ? '🎉 ¡Felicitaciones!' : '🎮 Juego Terminado'}
      </h1>
      <p className="text-xl text-gray-600">
        {isWinner ? '¡Ganaste el juego!' : `${winnerUsername} ganó esta ronda`}
      </p>
    </div>
  );
};
