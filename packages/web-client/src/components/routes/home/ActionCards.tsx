import { Users, Plus, LogIn } from 'lucide-react';
import { ActionCard } from './ActionCard';

export const ActionCards: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
      <ActionCard
        icon={Plus}
        title="Crear Sala"
        description="Crea una nueva sala de juego y comparte el código con tu oponente"
        to="/create-room"
        variant="success"
        buttonText="Crear Sala"
        buttonIcon={Users}
      />
      
      <ActionCard
        icon={LogIn}
        title="Unirse a Sala"
        description="Ingresa el código de una sala existente para unirte al juego"
        to="/join-room"
        variant="primary"
        buttonText="Unirse"
        buttonIcon={LogIn}
      />
    </div>
  );
};
