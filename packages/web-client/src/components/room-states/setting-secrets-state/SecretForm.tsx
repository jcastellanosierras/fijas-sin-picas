import { Key } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { Input } from '@/components/ui/Input';
import { useGame } from '@/context/game';
import { secretNumberSchema, type SecretNumberFormData } from '@/schemas/room';

export const SecretForm: React.FC = () => {
  const { setSecret } = useGame();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<SecretNumberFormData>({
    resolver: zodResolver(secretNumberSchema),
    defaultValues: {
      secret: '',
    },
  });

  const handleSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setValue('secret', value);
  };

  const onSubmitForm = async (data: SecretNumberFormData) => {
    const { error } = await setSecret(data.secret);
    if (error) {
      toast.error('Error al enviar el secreto');
      return;
    }

    toast.success('Secreto enviado correctamente');
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="space-y-6">
        {errors.secret && (
          <div className="mb-6">
            <ErrorAlert
              message={errors.secret.message || ''}
              onClose={() => {}}
            />
          </div>
        )}

        <Input
          label="Tu Número Secreto"
          type="text"
          {...register('secret')}
          onChange={handleSecretChange}
          error={errors.secret?.message}
          placeholder="0000"
          maxLength={4}
          className="text-center text-2xl font-mono tracking-widest"
          helperText="Ingresa 4 dígitos que tu oponente deberá adivinar"
        />

        <Button
          type="submit"
          variant="success"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          <Key className="h-5 w-5 mr-2" />
          Confirmar Secreto
        </Button>
      </div>
    </form>
  );
};
