import { useGameAPI } from '@/hooks/useGameAPI';
import type { CreateRoomDto, JoinRoomDto, Player, Room } from '@/types/rooms';
import { createContext, useContext, useEffect, useState } from 'react';

interface GameContextType {
  room: Room | null;
  player: Player | null;

  error: string | null;
  isLoading: boolean;

  createRoom: (room: CreateRoomDto) => Promise<void>;
  joinRoom: (room: JoinRoomDto) => Promise<void>;
  fetchRoom: (code?: string) => Promise<void>;
  getRoom: (code: string) => Promise<Room | null>;

  saveSession: () => void;
  clearSession: () => void;
}

const GameContext = createContext<GameContextType>({
  room: null,
  player: null,
  error: null,
  isLoading: false,
  createRoom: async () => {},
  joinRoom: async () => {},
  fetchRoom: async () => {},
  getRoom: async () => null,
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

  const createRoom = async (room: CreateRoomDto) => {
    const newRoom = await gameAPI.createRoom(room);
    setRoom(newRoom);
    saveSession();
  };

  const joinRoom = async (room: JoinRoomDto) => {
    const joinedRoom = await gameAPI.joinRoom(room);
    const newPlayer = joinedRoom?.players[1];
    if (!newPlayer) {
      return;
    }

    setPlayer({
      id: newPlayer.id,
      username: newPlayer.username,
      guesses: [],
    });

    const updatedRoom = await gameAPI.getRoom(joinedRoom.code);
    setRoom(updatedRoom);
    saveSession();
  };

  const fetchRoom = async (code?: string) => {
    const updatedRoom = await gameAPI.getRoom(code ?? room?.code ?? '');
    setRoom(updatedRoom);
  };

  const getRoom = async (code: string): Promise<Room | null> => {
    return await gameAPI.getRoom(code);
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
