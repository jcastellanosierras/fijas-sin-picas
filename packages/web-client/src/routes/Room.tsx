import { useParams, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useRoomPolling } from '@/hooks/useRoomPolling';
import {
  WaitingState,
  SettingSecretsState,
  InProgressState,
  FinishedState,
} from '@/components/room-states';
import { RoomState } from '@/types/rooms';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const Room: React.FC = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const { room, isLoading, error } = useRoomPolling({
    roomCode: code || '',
    intervalInMs: 2000,
    enabled: !!code,
  });

  useEffect(() => {
    if (error) {
      console.error('Error al obtener la sala:', error);
      navigate('/');
    }
  }, [error, navigate]);

  useEffect(() => {
    if (!code) {
      navigate('/');
    }
  }, [code, navigate]);

  if (isLoading && !room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando sala...</p>
      </div>
    );
  }

  switch (room.state) {
    case RoomState.WAITING:
      return <WaitingState room={room} />;

    case RoomState.SETTING_SECRETS:
      return <SettingSecretsState room={room} />;

    case RoomState.IN_PROGRESS:
      return <InProgressState room={room} />;

    case RoomState.FINISHED:
      return <FinishedState room={room} />;

    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Estado de sala desconocido</p>
        </div>
      );
  }
};
