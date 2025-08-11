import React from 'react';

import { 
  GameStatus, 
  GuessForm, 
  GuessHistory, 
  Header, 
  TipCard 
} from './in-progress-state';
import { GuessesResultsProvider } from '@/context/guesses-results';
import { useGame } from '@/context/game';
import type { Room } from '@/types/rooms';

interface InProgressStateProps {
  room: Room;
}

const InProgressStateContent: React.FC<InProgressStateProps> = ({ room }) => {
  const { player, fetchRoom } = useGame();

  if (!room || !player) return null;

  const currentPlayer = room.players.find((p) => p?.id === player.id);
  const otherPlayer = room.players.find((p) => p?.id !== player.id);
  const isMyTurn = room.currentTurnPlayerId === player.id;

  const handleGuessSubmitted = () => {
    // Refresh room data after a guess is submitted
    fetchRoom();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <GameStatus 
          room={room} 
          isMyTurn={isMyTurn} 
          otherPlayerUsername={otherPlayer?.username || 'Oponente'} 
        />

        <div className="grid lg:grid-cols-2 gap-8">
          <GuessForm 
            isMyTurn={isMyTurn}
            otherPlayerUsername={otherPlayer?.username || 'Oponente'}
            onGuessSubmitted={handleGuessSubmitted}
          />
          
          <GuessHistory 
            currentPlayer={currentPlayer!}
            otherPlayer={otherPlayer!}
            otherPlayerUsername={otherPlayer?.username || 'Oponente'}
          />
        </div>

        <div className="mt-8">
          <TipCard />
        </div>
      </div>
    </div>
  );
};

export const InProgressState: React.FC<InProgressStateProps> = ({ room }) => {
  return (
    <GuessesResultsProvider>
      <InProgressStateContent room={room} />
    </GuessesResultsProvider>
  );
};
