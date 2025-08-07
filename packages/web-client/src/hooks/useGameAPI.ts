import { useState } from 'react';
import { httpClient } from '@/lib/clients/http-client';
import type {
  CreateRoomDto,
  CreateRoomResponse,
  JoinRoomDto,
  JoinRoomResponse,
  Room,
} from '@/types/rooms';

export const useGameAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAPICall = async <T>(
    apiCall: () => Promise<Response>,
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall();

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Error desconocido' }));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      if (
        response.status === 200 &&
        response.headers.get('content-length') === '0'
      ) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getRoom = async (code: string) => {
    return await handleAPICall<Room>(() => httpClient.get(`/rooms/${code}`));
  };

  const createRoom = async (room: CreateRoomDto) => {
    return await handleAPICall<CreateRoomResponse>(() =>
      httpClient.post('/rooms', room),
    );
  };

  const joinRoom = async (room: JoinRoomDto) => {
    return await handleAPICall<JoinRoomResponse>(() =>
      httpClient.post('/rooms/join', room),
    );
  };

  return { createRoom, joinRoom, getRoom, isLoading, error };
};
