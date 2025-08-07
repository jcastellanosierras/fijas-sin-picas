import { Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export const TipCard: React.FC = () => {
  return (
    <div className="mt-8">
      <Card>
        <div className="flex items-start space-x-3">
          <Search className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">¿Buscando una sala?</h3>
            <p className="text-sm text-gray-600">
              Pide al creador de la sala que te comparta el código y la contraseña para poder unirte al juego.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
