import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <>
      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Plus className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Sala</h1>
        <p className="text-gray-600">Configura una nueva sala de juego</p>
      </div>
    </>
  );
};
