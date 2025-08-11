import React from 'react';

import { Card } from '@/components/ui/Card';

export const TipCard: React.FC = () => {
  return (
    <Card>
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 mb-2">
          💡 Consejo Estratégico
        </h3>
        <p className="text-sm text-gray-600">
          Elige un número que sea difícil de adivinar, pero recuerda que
          tu oponente también está pensando estratégicamente. ¡Evita
          patrones obvios como 1234 o 1111!
        </p>
      </div>
    </Card>
  );
};
