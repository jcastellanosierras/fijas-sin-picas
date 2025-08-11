import { Copy, Users } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Room } from '@/types/rooms';

interface RoomInfoProps {
  room: Room;
}

export const RoomInfo: React.FC<RoomInfoProps> = ({ room }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Código copiado al portapapeles');
    });
  };

  return (
    <Card>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Información de la Sala
        </h2>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Código de Sala</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold text-gray-900">
                {room.code}
              </span>
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
  );
};
