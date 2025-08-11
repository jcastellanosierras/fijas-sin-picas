import React from 'react';
import { Users, Copy, Clock, LogOut } from 'lucide-react';
import type { Room } from '@/types/rooms';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGame } from '@/context/game';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

interface WaitingStateProps {
  room: Room;
}

export const WaitingState: React.FC<WaitingStateProps> = ({ room }) => {
  const { leaveRoom } = useGame();
  const navigate = useNavigate();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Código copiado al portapapeles');
    });
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Esperando Jugador</h1>
          <p className="text-gray-600">Comparte el código de sala con tu oponente</p>
        </div>

        <Card>
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de la Sala</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Código de Sala</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold text-gray-900">{room.code}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(room.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    Jugadores: {room.players?.filter(Boolean).length || 1}/2
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Jugador 1 (Host):</p>
              <div className="bg-green-100 rounded-lg p-3">
                <span className="text-green-800 font-semibold">
                  {room.players?.[0]?.username || 'Host'}
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-2">Jugador 2:</p>
              <div className="bg-gray-100 rounded-lg p-3 border-2 border-dashed border-gray-300">
                <span className="text-gray-500 italic">Esperando...</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8 space-y-4">
          <Card>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">📋 Instrucciones</h3>
              <p className="text-sm text-gray-600">
                Comparte el código <span className="font-mono font-semibold">{room.code}</span> con tu oponente para que pueda unirse a la sala. El juego comenzará automáticamente cuando ambos jugadores estén listos.
              </p>
            </div>
          </Card>

          <Button
            variant="danger"
            onClick={handleLeaveRoom}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Salir de la Sala
          </Button>
        </div>
      </div>
    </div>
  );
};
