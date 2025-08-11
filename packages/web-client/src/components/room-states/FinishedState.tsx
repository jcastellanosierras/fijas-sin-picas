import { useNavigate } from 'react-router';

import {
  ActionButtons,
  FinalMessage,
  GameStatistics,
  Header,
  WinnerCard,
} from './finished-state';
import { GuessesResultsProvider } from '@/context/guesses-results';
import { useGame } from '@/context/game';
import type { Room } from '@/types/rooms';

interface FinishedStateProps {
  room: Room;
}

export const FinishedState: React.FC<FinishedStateProps> = ({ room }) => {
  const { player, leaveRoom } = useGame();
  const navigate = useNavigate();

  if (!room || !player) return null;

  const currentPlayer = room.players.find((p) => p?.id === player.id);
  const otherPlayer = room.players.find((p) => p?.id !== player.id);
  const winner = room.players.find((p) => p?.id === room.winner);
  const isWinner = room.winner === player.id;
  const mySecret =
    room.secrets?.[room.players.findIndex((p) => p?.id === player.id)];
  const otherPlayerSecret =
    room.secrets?.[room.players.findIndex((p) => p?.id !== player.id)];

  const handlePlayAgain = () => {
    leaveRoom();
    navigate('/');
  };

  if (!currentPlayer || !otherPlayer || !winner) return null;

  return (
    <GuessesResultsProvider>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Header isWinner={isWinner} winnerUsername={winner.username} />

          <WinnerCard
            room={room}
            winnerUsername={winner.username}
            otherPlayerUsername={otherPlayer.username}
            mySecret={mySecret!}
            otherPlayerSecret={otherPlayerSecret!}
          />

          <GameStatistics
            currentPlayer={currentPlayer}
            otherPlayer={otherPlayer}
            otherPlayerUsername={otherPlayer.username}
          />

          <ActionButtons onPlayAgain={handlePlayAgain} />

          <FinalMessage isWinner={isWinner} />
        </div>
      </div>
    </GuessesResultsProvider>
  );
};
