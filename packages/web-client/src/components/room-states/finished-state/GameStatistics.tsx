import React from 'react';
import { Medal } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { useGuessesResults } from '@/context/guesses-results';
import type { Guess, Player } from '@/types/rooms';

interface GameStatisticsProps {
  currentPlayer: Player;
  otherPlayer: Player;
  otherPlayerUsername: string;
}

export const GameStatistics: React.FC<GameStatisticsProps> = ({ 
  currentPlayer, 
  otherPlayer, 
  otherPlayerUsername 
}) => {
  const { getGuessResult } = useGuessesResults();

  const formatGuesses = (guesses: Guess[] = [], isCurrentPlayer: boolean = false) => {
    return guesses.map((guess) => {
      let resultDisplay = '?';
      
      if (isCurrentPlayer) {
        // Para el jugador actual, usar el contexto de resultados
        const result = getGuessResult(guess.id);
        if (result) {
          resultDisplay = result.isWinner ? '🎉 ¡GANADOR!' : `${result.exactMatches} fijas`;
        }
      } else {
        // Para el oponente, calcular basado en el secreto del jugador actual
        if (currentPlayer.secret) {
          const exactMatches = currentPlayer.secret.split('').filter((digit, index) => {
            return digit === guess.guess[index];
          }).length;
          resultDisplay = exactMatches === 4 ? '🎉 ¡GANADOR!' : `${exactMatches} fijas`;
        }
      }

      return (
        <div key={guess.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
          <span className="font-mono text-lg">{guess.guess}</span>
          <span className="text-sm font-medium">
            {resultDisplay}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-8">
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Medal className="h-5 w-5 mr-2 text-blue-500" />
          Tus Adivinanzas
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {currentPlayer?.guesses && currentPlayer.guesses.length > 0 ? (
            formatGuesses(currentPlayer.guesses, true)
          ) : (
            <p className="text-gray-500 italic">No realizaste adivinanzas</p>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total de adivinanzas: {currentPlayer?.guesses?.length || 0}
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Medal className="h-5 w-5 mr-2 text-purple-500" />
          Adivinanzas de {otherPlayerUsername}
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {otherPlayer?.guesses && otherPlayer.guesses.length > 0 ? (
            formatGuesses(otherPlayer.guesses, false)
          ) : (
            <p className="text-gray-500 italic">No realizó adivinanzas</p>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total de adivinanzas: {otherPlayer?.guesses?.length || 0}
          </p>
        </div>
      </Card>
    </div>
  );
};
