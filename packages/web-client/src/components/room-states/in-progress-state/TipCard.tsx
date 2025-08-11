import { Card } from '@/components/ui/Card';

export const TipCard: React.FC = () => {
  return (
    <Card>
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Recuerda</h3>
        <p className="text-sm text-gray-600">
          "Fijas" significa dígitos correctos en la posición correcta. Usa esta información para deducir el número secreto de tu oponente. ¡Buena suerte!
        </p>
      </div>
    </Card>
  );
};
