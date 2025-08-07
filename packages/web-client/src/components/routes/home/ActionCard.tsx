import { type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Link } from 'react-router';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  variant: 'success' | 'primary';
  buttonText: string;
  buttonIcon: LucideIcon;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon: Icon,
  title,
  description,
  to,
  variant,
  buttonText,
  buttonIcon: ButtonIcon,
}) => {
  const variantClasses = {
    success: 'text-green-500',
    primary: 'text-blue-500',
  };

  const buttonClasses = {
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  };

  return (
    <Card className="text-center hover:scale-105 transition-transform duration-200">
      <Icon className={`h-12 w-12 ${variantClasses[variant]} mx-auto mb-4`} />
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link
        to={to}
        className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonClasses[variant]} px-6 py-3 text-lg cursor-pointer w-full`}
      >
        <ButtonIcon className="h-5 w-5 mr-2" />
        {buttonText}
      </Link>
    </Card>
  );
};
