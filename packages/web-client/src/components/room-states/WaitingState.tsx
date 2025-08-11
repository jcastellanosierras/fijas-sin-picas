import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/Button';
import { Header, Instructions, RoomInfo } from './waiting-state';
import { useGame } from '@/context/game';
import type { Room } from '@/types/rooms';

interface WaitingStateProps {
  room: Room;
}

export const WaitingState: React.FC<WaitingStateProps> = ({ room }) => {
  const { leaveRoom } = useGame();
  const navigate = useNavigate();

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Header />
        <RoomInfo room={room} />

        <div className="mt-8 space-y-4">
          <Instructions room={room} />

          <Button variant="danger" onClick={handleLeaveRoom} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Salir de la Sala
          </Button>
        </div>
      </div>
    </div>
  );
};
