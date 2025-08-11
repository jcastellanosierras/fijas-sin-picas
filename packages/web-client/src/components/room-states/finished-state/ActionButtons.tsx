import React from 'react';
import { Home } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface ActionButtonsProps {
  onPlayAgain: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onPlayAgain }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">      
      <Button
        onClick={onPlayAgain}
        variant="secondary"
        size="lg"
        className="sm:w-auto cursor-pointer"
      >
        <Home className="h-5 w-5 mr-2" />
        Volver al Inicio
      </Button>
    </div>
  );
};
