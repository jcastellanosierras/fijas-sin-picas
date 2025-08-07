import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header, CreateRoomForm, TipCard } from '@/components/routes/create-room';

export const CreateRoom: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleCreateRoom = async (formData: { code: string; password: string; username: string }) => {
    setIsCreating(true);
    // TODO: Usar formData para crear la sala
    console.log('Creating room with:', formData);
    // Aquí iría la lógica para crear la sala
    // Por ahora solo simulamos un delay
    setTimeout(() => {
      setIsCreating(false);
      handleBack();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Header onBack={handleBack} />
        <CreateRoomForm onSubmit={handleCreateRoom} isLoading={isCreating} />
        <TipCard />
      </div>
    </div>
  );
};
