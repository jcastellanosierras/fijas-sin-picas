import { Clock } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-pulse">
        <Clock className="h-8 w-8 text-yellow-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Esperando Jugador
      </h1>
      <p className="text-gray-600">
        Comparte el código de sala con tu oponente
      </p>
    </div>
  );
};
