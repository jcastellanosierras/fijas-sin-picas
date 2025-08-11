import React from 'react';

import { Card } from '@/components/ui/Card';
import { useGuessesResults } from '@/context/guesses-results';
import type { Guess, Player } from '@/types/rooms';
import { useGame } from '@/context/game';

interface GuessHistoryProps {
  currentPlayer: Player;
  otherPlayer: Player;
  otherPlayerUsername: string;
}

export const GuessHistory: React.FC<GuessHistoryProps> = ({
  currentPlayer,
  otherPlayer,
  otherPlayerUsername,
}) => {
  const { room } = useGame();
  const { getGuessResult } = useGuessesResults();

  const getMyGuessResultDisplay = (guess: Guess) => {
    const result = getGuessResult(guess.id);
    if (!result) return '?';
    if (result.isWinner) return '🎉 ¡GANASTE!';
    return `${result.exactMatches} fijas`;
  };

  const getOpponentGuessResultDisplay = (guess: Guess) => {
    const me = room?.players.find((player) => player?.id === otherPlayer.id);
    if (!me?.secret) return '?';

    const exactMatches = me.secret.split('').filter((digit, index) => {
      return digit === guess.guess[index];
    }).length;

    return `${exactMatches} fijas`;
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Historial de Adivinanzas
      </h2>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {/* Your guesses */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Tus Adivinanzas
          </h3>
          <div className="space-y-2">
            {currentPlayer?.guesses && currentPlayer.guesses.length > 0 ? (
              currentPlayer.guesses.map((guessItem) => (
                <div
                  key={guessItem.id}
                  className="bg-blue-50 rounded-lg p-3 flex justify-between items-center"
                >
                  <span className="font-mono text-lg font-semibold text-blue-900">
                    {guessItem.guess}
                  </span>
                  <span className="text-sm font-medium text-blue-700">
                    {getMyGuessResultDisplay(guessItem)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm">
                Sin adivinanzas aún
              </p>
            )}
          </div>
        </div>

        {/* Opponent's guesses */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Adivinanzas de {otherPlayerUsername}
          </h3>
          <div className="space-y-2">
            {otherPlayer?.guesses && otherPlayer.guesses.length > 0 ? (
              otherPlayer.guesses.map((guessItem) => (
                <div
                  key={guessItem.id}
                  className="bg-gray-50 rounded-lg p-3 flex justify-between items-center"
                >
                  <span className="font-mono text-lg font-semibold text-gray-900">
                    {guessItem.guess}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {getOpponentGuessResultDisplay(guessItem)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm">
                Sin adivinanzas aún
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
