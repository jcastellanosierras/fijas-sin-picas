import React, { useState } from 'react';

import {
  GameStatus,
  GuessForm,
  GuessHistory,
  GuessHistoryDialog,
  Header,
  MobileHistoryButton,
  PlayerSecret,
  TipCard,
} from './in-progress-state';
import { GuessesResultsProvider } from '@/context/guesses-results';
import { useGame } from '@/context/game';
import type { Room } from '@/types/rooms';

interface InProgressStateProps {
  room: Room;
}

const InProgressStateContent: React.FC<InProgressStateProps> = ({ room }) => {
  const { player, fetchRoom } = useGame();
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  if (!room || !player) return null;

  const currentPlayer = room.players.find((p) => p?.id === player.id);
  const otherPlayer = room.players.find((p) => p?.id !== player.id);
  const isMyTurn = room.currentTurnPlayerId === player.id;

  const handleGuessSubmitted = () => {
    // Refresh room data after a guess is submitted
    fetchRoom();
  };

  const handleOpenHistory = () => {
    setIsHistoryDialogOpen(true);
  };

  const handleCloseHistory = () => {
    setIsHistoryDialogOpen(false);
  };

  if (!currentPlayer || !otherPlayer) return null;

  const totalGuesses =
    (currentPlayer.guesses?.length || 0) + (otherPlayer.guesses?.length || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 md:py-8 px-3 md:px-4 overflow-x-hidden">
      <Header />

      <GameStatus
        room={room}
        isMyTurn={isMyTurn}
        otherPlayerUsername={otherPlayer.username}
      />

      <div className="flex-1 grid lg:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col">
          {currentPlayer.secret && (
            <PlayerSecret secret={currentPlayer.secret} />
          )}

          <GuessForm
            isMyTurn={isMyTurn}
            otherPlayerUsername={otherPlayer.username}
            onGuessSubmitted={handleGuessSubmitted}
          />
        </div>

        <div className="hidden md:block">
          <GuessHistory
            currentPlayer={currentPlayer}
            otherPlayer={otherPlayer}
            otherPlayerUsername={otherPlayer.username}
            onOpenDialog={handleOpenHistory}
          />
        </div>
      </div>

      <div className="block md:hidden mt-4">
        <MobileHistoryButton
          onClick={handleOpenHistory}
          totalGuesses={totalGuesses}
        />
      </div>

      {/* Dialog del historial para móvil */}
      <GuessHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={handleCloseHistory}
        currentPlayer={currentPlayer}
        otherPlayer={otherPlayer}
        otherPlayerUsername={otherPlayer.username}
      />
      <TipCard />
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
