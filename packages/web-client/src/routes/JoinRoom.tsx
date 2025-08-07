import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const JoinRoom: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return;
    
    setIsJoining(true);
    // Aquí iría la lógica para unirse a la sala
    // Por ahora solo simulamos un delay
    setTimeout(() => {
      setIsJoining(false);
      handleBack();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Button 
            onClick={handleBack}
            variant="secondary"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Unirse a Sala</h1>
          <p className="text-gray-600">Ingresa el código de la sala</p>
        </div>

        <Card>
          <div className="space-y-4">
            <div>
              <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-2">
                Código de la Sala
              </label>
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Ej: ABC123"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
              />
            </div>
            
            <Button 
              onClick={handleJoinRoom}
              className="w-full"
              disabled={isJoining || !roomCode.trim()}
            >
              {isJoining ? 'Uniéndose...' : 'Unirse'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
