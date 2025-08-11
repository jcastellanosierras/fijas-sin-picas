import { Card } from '@/components/ui/Card';

export const TipCard: React.FC = () => {
  return (
    <Card className="p-4 md:p-6">
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
          💡 Recuerda
        </h3>
        <p className="text-xs md:text-sm text-gray-600">
          "Fijas" significa dígitos correctos en la posición correcta. Usa esta
          información para deducir el número secreto de tu oponente. ¡Buena
          suerte!
        </p>
      </div>
    </Card>
  );
};
