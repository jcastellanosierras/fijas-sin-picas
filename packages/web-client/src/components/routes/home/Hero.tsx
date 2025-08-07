import { TowerControl as GameController } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <GameController className="h-20 w-20 text-blue-500 mx-auto mb-6" />
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Fijas Sin Picas
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Un juego de lógica y deducción para dos jugadores. Adivina el número
        secreto de 4 dígitos de tu oponente usando las pistas de "fijas"
        (dígitos correctos en posición correcta).
      </p>
    </div>
  );
};
