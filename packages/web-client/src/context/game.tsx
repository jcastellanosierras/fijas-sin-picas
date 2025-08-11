import { useGameAPI } from '@/hooks/useGameAPI';
import type { Result } from '@/lib/result';
import type { CreateRoomDto, CreateRoomResponse, JoinRoomDto, JoinRoomResponse, Player, Room } from '@/types/rooms';
import { createContext, useContext, useEffect, useState } from 'react';

interface GameContextType {
  room: Room | null;
  player: Player | null;

  error: string | null;
  isLoading: boolean;

  createRoom: (room: CreateRoomDto) => Promise<Result<CreateRoomResponse>>;
  joinRoom: (room: JoinRoomDto) => Promise<Result<JoinRoomResponse>>;
  fetchRoom: (code?: string) => Promise<Result<void>>;
  getRoom: (code: string) => Promise<Result<Room | null>>;
  leaveRoom: () => void;

  saveSession: () => void;
  clearSession: () => void;
}

const GameContext = createContext<GameContextType>({
  room: null,
  player: null,
  error: null,
  isLoading: false,
  createRoom: async () => ({ data: null, error: new Error('Not implemented') }),
  joinRoom: async () => ({ data: null, error: new Error('Not implemented') }),
  fetchRoom: async () => ({ data: null, error: new Error('Not implemented') }),
  getRoom: async () => ({ data: null, error: new Error('Not implemented') }),
  leaveRoom: () => {},
  saveSession: () => {},
  clearSession: () => {},
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  const gameAPI = useGameAPI();

  const loadSession = () => {
    const room = localStorage.getItem('fijas-sin-picas-room');
    const player = localStorage.getItem('fijas-sin-picas-player');
    if (room && player) {
      setRoom(JSON.parse(room));
      setPlayer(JSON.parse(player));
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const saveSession = () => {
    localStorage.setItem('fijas-sin-picas-room', JSON.stringify(room));
    localStorage.setItem('fijas-sin-picas-player', JSON.stringify(player));
  };

  const clearSession = () => {
    localStorage.removeItem('fijas-sin-picas-room');
    localStorage.removeItem('fijas-sin-picas-player');
  };

  const createRoom = async (room: CreateRoomDto): Promise<Result<CreateRoomResponse>> => {
    const { data: newRoom, error } = await gameAPI.createRoom(room);
    if (error) {
      return { data: null, error };
    }

    setRoom(newRoom);
    saveSession();

    return { data: newRoom, error: null };
  };

  const joinRoom = async (room: JoinRoomDto): Promise<Result<JoinRoomResponse>> => {
    const { data: joinedRoom, error } = await gameAPI.joinRoom(room);
    if (error) {
      return { data: null, error };
    }

    const newPlayer = joinedRoom?.players[1];
    if (!newPlayer) {
      return { data: null, error: new Error('No new player') };
    }

    setPlayer({
      id: newPlayer.id,
      username: newPlayer.username,
      guesses: [],
    });

    const { data: updatedRoom, error: error2 } = await gameAPI.getRoom(
      joinedRoom.code,
    );
    if (error2) {
      return { data: null, error: error2 };
    }

    setRoom(updatedRoom);
    saveSession();

    return { data: joinedRoom, error: null };
  };

  const fetchRoom = async (code?: string): Promise<Result<void>> => {
    const { data: updatedRoom, error: error2 } = await gameAPI.getRoom(
      code ?? room?.code ?? '',
    );
    if (error2) {
      return { data: null, error: error2 };
    }

    setRoom(updatedRoom);

    return { data: undefined, error: null };
  };

  const getRoom = async (code: string): Promise<Result<Room | null>> => {
    const { data: updatedRoom, error: error2 } = await gameAPI.getRoom(code);
    if (error2) {
      return { data: null, error: error2 };
    }

    return { data: updatedRoom, error: null };
  };

  const leaveRoom = () => {
    setRoom(null);
    setPlayer(null);
    clearSession();
  };

  return (
    <GameContext.Provider
      value={{
        room,
        player,
        error: gameAPI.error,
        isLoading: gameAPI.isLoading,
        createRoom,
        joinRoom,
        fetchRoom,
        getRoom,
        leaveRoom,
        saveSession,
        clearSession,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
