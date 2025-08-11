import React from 'react';
import { Target, Trophy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { Input } from '@/components/ui/Input';
import { useGame } from '@/context/game';
import { useGuessesResults } from '@/context/guesses-results';

const guessSchema = z.object({
  guess: z.string()
    .length(4, 'La adivinanza debe tener exactamente 4 dígitos')
    .regex(/^\d{4}$/, 'Solo se permiten números'),
});

type GuessFormData = z.infer<typeof guessSchema>;

interface GuessFormProps {
  isMyTurn: boolean;
  otherPlayerUsername: string;
  onGuessSubmitted: () => void;
}

export const GuessForm: React.FC<GuessFormProps> = ({ 
  isMyTurn, 
  otherPlayerUsername, 
  onGuessSubmitted 
}) => {
  const { makeGuess, error: gameError } = useGame();
  const { addGuessResult } = useGuessesResults();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<GuessFormData>({
    resolver: zodResolver(guessSchema),
    defaultValues: {
      guess: '',
    },
  });

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setValue('guess', value);
  };

  const onSubmitForm = async (data: GuessFormData) => {
    if (!isMyTurn) {
      toast.error('No es tu turno');
      return;
    }

    const { data: guessResponse, error } = await makeGuess(data.guess);
    if (error) {
      toast.error('Error al enviar la adivinanza');
      return;
    }

    if (guessResponse) {
      addGuessResult(guessResponse);
    }

    toast.success('Adivinanza enviada correctamente');
    reset();
    onGuessSubmitted();
  };

  if (!isMyTurn) {
    return (
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-500" />
          Hacer Adivinanza
        </h2>
        
        <div className="bg-yellow-50 rounded-lg p-6 text-center">
          <Target className="h-12 w-12 text-yellow-500 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Esperando Turno</h3>
          <p className="text-yellow-600">
            Es el turno de {otherPlayerUsername}. Espera tu turno para hacer la siguiente adivinanza.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Target className="h-5 w-5 mr-2 text-blue-500" />
        Hacer Adivinanza
      </h2>

      {gameError && (
        <div className="mb-6">
          <ErrorAlert message={gameError} onClose={() => {}} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="space-y-4">
          <Input
            label="Tu Adivinanza"
            type="text"
            {...register('guess')}
            onChange={handleGuessChange}
            error={errors.guess?.message}
            placeholder="0000"
            maxLength={4}
            className="text-center text-2xl font-mono tracking-widest"
            helperText={`Intenta adivinar el número de ${otherPlayerUsername}`}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            <Trophy className="h-5 w-5 mr-2" />
            Enviar Adivinanza
          </Button>
        </div>
      </form>
    </Card>
  );
};
