import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/Button';
import { 
  Header, 
  PlayersStatus, 
  SecretForm, 
  SecretConfirmed, 
  TipCard 
} from './setting-secrets-state';
import { useGame } from '@/context/game';
import type { Room } from '@/types/rooms';

interface SettingSecretsStateProps {
  room: Room;
}

export const SettingSecretsState: React.FC<SettingSecretsStateProps> = ({
  room,
}) => {
  const { leaveRoom, player } = useGame();
  const navigate = useNavigate();

  if (!room || !player) return null;

  const currentPlayer = room.players.find((p) => p?.id === player.id);
  const hasSetSecret = currentPlayer?.secret !== undefined;

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Header />
        <PlayersStatus room={room} playerId={player.id} />

        {!hasSetSecret ? (
          <SecretForm />
        ) : (
          <SecretConfirmed room={room} playerId={player.id} />
        )}

        <div className="mt-8 space-y-4">
          <TipCard />

          <Button variant="danger" onClick={handleLeaveRoom} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Salir de la Sala
          </Button>
        </div>
      </div>
    </div>
  );
};
