import { useState } from 'react';
import type { AxiosResponse } from 'axios';
import { httpClient } from '@/lib/clients/http-client';
import type {
  CreateRoomDto,
  CreateRoomResponse,
  JoinRoomDto,
  JoinRoomResponse,
  MakeGuessResponse,
  Room,
} from '@/types/rooms';
import type { Result } from '@/lib/result';

const SUCCESS_STATUS_CODES = [200, 201, 204];

export const useGameAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAPICall = async <T>(
    apiCall: () => Promise<AxiosResponse>,
  ): Promise<Result<T>> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall();

      if (!SUCCESS_STATUS_CODES.includes(response.status)) {
        throw new Error(
          response.data.message ||
            `Error HTTP: ${response.status} ${response.statusText}`,
        );
      }

      setIsLoading(false);

      return { data: response.data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');

      setIsLoading(false);
      setError(error.message);

      return { data: null, error };
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
      httpClient.post(`/rooms/${room.code}/join`, {
        password: room.password,
        username: room.username,
      }),
    );
  };

  const setSecret = async (
    roomId: string,
    playerId: string,
    secret: string,
  ) => {
    return await handleAPICall<void>(() =>
      httpClient.post(`/rooms/${roomId}/secret/${playerId}`, {
        secret,
      }),
    );
  };

  const makeGuess = async (roomId: string, playerId: string, guess: string) => {
    return await handleAPICall<MakeGuessResponse>(() =>
      httpClient.post(`/rooms/${roomId}/guess/${playerId}`, {
        guess,
      }),
    );
  };

  return {
    createRoom,
    joinRoom,
    getRoom,
    setSecret,
    makeGuess,
    isLoading,
    error,
  };
};
