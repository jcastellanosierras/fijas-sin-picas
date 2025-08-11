import { History, Medal } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface MobileHistoryButtonProps {
  onClick: () => void;
  totalGuesses: number;
}

export const MobileHistoryButton: React.FC<MobileHistoryButtonProps> = ({
  onClick,
  totalGuesses,
}) => {
  return (
    <div className="block md:hidden mb-3">
      <Button
        onClick={onClick}
        variant="secondary"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        size="md"
      >
        <div className="flex items-center justify-center space-x-3 py-1">
          <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
            <History className="h-4 w-4 text-white" />
          </div>

          <span className="text-sm font-semibold tracking-wide">
            Ver Historial
          </span>

          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
            <Medal className="h-3 w-3 text-yellow-300" />
            <span className="text-xs font-bold text-white">{totalGuesses}</span>
          </div>
        </div>
      </Button>
    </div>
  );
};
