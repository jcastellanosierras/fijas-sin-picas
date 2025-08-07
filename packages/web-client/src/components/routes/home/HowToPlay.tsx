import { Card } from '@/components/ui/Card';

interface StepProps {
  number: number;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple';
}

const Step: React.FC<StepProps> = ({ number, title, description, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="text-center">
      <div className={`${colorClasses[color]} rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center`}>
        <span className="font-bold">{number}</span>
      </div>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export const HowToPlay: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Configura tu secreto',
      description: 'Elige un número de 4 dígitos que tu oponente debe adivinar',
      color: 'blue' as const,
    },
    {
      number: 2,
      title: 'Haz adivinanzas',
      description: 'Por turnos, intenta adivinar el número secreto del oponente',
      color: 'green' as const,
    },
    {
      number: 3,
      title: 'Usa las pistas',
      description: 'Recibe el número de "fijas" para deducir el número correcto',
      color: 'purple' as const,
    },
  ];

  return (
    <div className="mt-16 max-w-3xl mx-auto">
      <Card>
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          ¿Cómo se juega?
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <Step key={step.number} {...step} />
          ))}
        </div>
      </Card>
    </div>
  );
};
