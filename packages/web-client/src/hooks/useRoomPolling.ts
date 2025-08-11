import { useEffect, useState, useRef } from 'react';
import { useGame } from '@/context/game';
import type { Room } from '@/types/rooms';

interface UseRoomPollingOptions {
  roomCode: string;
  intervalInMs?: number;
  enabled?: boolean;
}

export const useRoomPolling = ({
  roomCode,
  intervalInMs = 2000,
  enabled = true,
}: UseRoomPollingOptions) => {
  const { getRoom } = useGame();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRoom = async () => {
    if (!enabled || !roomCode) return;

    setIsLoading(true);
    setError(null);

    const result = await getRoom(roomCode);
    if (result.error) {
      setError(result.error.message);
    } else {
      setRoom(result.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!enabled || !roomCode) return;

    fetchRoom();

    intervalRef.current = setInterval(fetchRoom, intervalInMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, intervalInMs, enabled]);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startPolling = () => {
    if (!intervalRef.current && enabled) {
      intervalRef.current = setInterval(fetchRoom, intervalInMs);
    }
  };

  return {
    room,
    isLoading,
    error,
    refetch: fetchRoom,
    stopPolling,
    startPolling,
  };
};
