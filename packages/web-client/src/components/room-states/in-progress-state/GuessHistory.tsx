import { Medal, Maximize2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useGuessesResults } from '@/context/guesses-results';
import type { Guess, Player } from '@/types/rooms';

interface GuessHistoryProps {
  currentPlayer: Player;
  otherPlayer: Player;
  otherPlayerUsername: string;
  onOpenDialog: () => void;
}

enum TabType {
  MY_GUESSES = 'my-guesses',
  OPPONENT_GUESSES = 'opponent-guesses',
}

export const GuessHistory: React.FC<GuessHistoryProps> = ({
  currentPlayer,
  otherPlayer,
  otherPlayerUsername,
  onOpenDialog,
}) => {
  const { getGuessResult } = useGuessesResults();
  const [activeTab, setActiveTab] = useState<TabType>(TabType.MY_GUESSES);

  const getMyGuessResultDisplay = (guess: Guess) => {
    const result = getGuessResult(guess.id);
    if (!result) return '?';
    if (result.isWinner) return '🎉 ¡GANASTE!';
    return `${result.exactMatches} fijas`;
  };

  const getOpponentGuessResultDisplay = (guess: Guess) => {
    if (!currentPlayer.secret) return '?';

    const exactMatches = currentPlayer.secret.split('').filter((digit, index) => {
      return digit === guess.guess[index];
    }).length;

    return `${exactMatches} fijas`;
  };

  const formatGuesses = (guesses: Guess[], isCurrentPlayer: boolean = false) => {
    // Ordenar de forma invertida (último primero)
    const sortedGuesses = [...guesses].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sortedGuesses.map((guess) => {
      const resultDisplay = isCurrentPlayer 
        ? getMyGuessResultDisplay(guess)
        : getOpponentGuessResultDisplay(guess);

      return (
        <div
          key={guess.id}
          className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded"
        >
          <span className="font-mono text-lg">{guess.guess}</span>
          <span className="text-sm font-medium">
            {resultDisplay}
          </span>
        </div>
      );
    });
  };

  const renderTabContent = () => {
    if (activeTab === TabType.MY_GUESSES) {
      return (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {currentPlayer?.guesses && currentPlayer.guesses.length > 0 ? (
            formatGuesses(currentPlayer.guesses, true)
          ) : (
            <p className="text-gray-500 italic">No realizaste adivinanzas</p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total de adivinanzas: {currentPlayer?.guesses?.length || 0}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {otherPlayer?.guesses && otherPlayer.guesses.length > 0 ? (
          formatGuesses(otherPlayer.guesses, false)
        ) : (
          <p className="text-gray-500 italic">No realizó adivinanzas</p>
        )}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total de adivinanzas: {otherPlayer?.guesses?.length || 0}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Historial de Adivinanzas</h2>
          
          {/* Botón para abrir dialog en escritorio */}
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenDialog}
            className="hidden md:flex items-center space-x-2 cursor-pointer"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab(TabType.MY_GUESSES)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === TabType.MY_GUESSES
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Medal className="h-4 w-4 text-blue-500" />
              <span>Tus Adivinanzas</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab(TabType.OPPONENT_GUESSES)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === TabType.OPPONENT_GUESSES
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Medal className="h-4 w-4 text-purple-500" />
              <span>{otherPlayerUsername}</span>
            </div>
          </button>
        </div>
      </div>

      {renderTabContent()}
    </Card>
  );
};
