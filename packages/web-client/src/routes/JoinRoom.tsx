import { useNavigate } from 'react-router';
import { Header, JoinRoomForm, TipCard } from '@/components/routes/join-room';

export const JoinRoom: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Header onBack={handleBack} />
        <JoinRoomForm />
        <TipCard />
      </div>
    </div>
  );
};
