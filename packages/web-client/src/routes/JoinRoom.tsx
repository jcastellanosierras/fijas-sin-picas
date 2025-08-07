import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header, JoinRoomForm, TipCard } from '@/components/routes/join-room';

export const JoinRoom: React.FC = () => {
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleJoinRoom = async (formData: { code: string; password: string; username: string }) => {
    setIsJoining(true);
    // TODO: Usar formData para unirse a la sala
    console.log('Joining room with:', formData);
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
        <Header onBack={handleBack} />
        <JoinRoomForm onSubmit={handleJoinRoom} isLoading={isJoining} />
        <TipCard />
      </div>
    </div>
  );
};
