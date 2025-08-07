import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const CreateRoom: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleCreateRoom = async () => {
    setIsCreating(true);
    // Aquí iría la lógica para crear la sala
    // Por ahora solo simulamos un delay
    setTimeout(() => {
      setIsCreating(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Sala</h1>
          <p className="text-gray-600">Crea una nueva sala de juego</p>
        </div>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Al crear una sala, se generará un código único que podrás compartir con tu oponente.
            </p>
            
            <Button 
              onClick={handleCreateRoom}
              variant="success"
              className="w-full"
              disabled={isCreating}
            >
              {isCreating ? 'Creando...' : 'Crear Sala'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
