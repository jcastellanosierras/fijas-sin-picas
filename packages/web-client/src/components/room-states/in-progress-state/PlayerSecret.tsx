import React from 'react';
import { Key } from 'lucide-react';

interface PlayerSecretProps {
  secret: string;
}

export const PlayerSecret: React.FC<PlayerSecretProps> = ({ secret }) => {
  return (
    <div className="mb-2 md:mb-3">
      <div className="flex items-center justify-center space-x-2 md:space-x-3 bg-green-50 rounded-lg p-2 md:p-3 border border-green-200">
        <Key className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
        <span className="text-xs md:text-sm font-medium text-green-800">Tu secreto:</span>
        <span className="text-base md:text-lg font-mono font-bold text-green-900 tracking-wider">
          {secret}
        </span>
      </div>
    </div>
  );
};
