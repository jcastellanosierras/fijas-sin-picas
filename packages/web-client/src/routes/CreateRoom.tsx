import { useNavigate } from 'react-router';
import { Header, CreateRoomForm, TipCard } from '@/components/routes/create-room';

export const CreateRoom: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Header onBack={handleBack} />
        <CreateRoomForm />
        <TipCard />
      </div>
    </div>
  );
};
