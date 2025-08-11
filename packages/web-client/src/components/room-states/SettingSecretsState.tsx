import React from 'react';
import { Key, Users, Check, Clock, LogOut } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Room } from '@/types/rooms';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { useGame } from '@/context/game';
import { useNavigate } from 'react-router';
import { secretNumberSchema, type SecretNumberFormData } from '@/schemas/room';
import { toast } from 'sonner';

interface SettingSecretsStateProps {
  room: Room;
}

export const SettingSecretsState: React.FC<SettingSecretsStateProps> = ({
  room,
}) => {
  const { leaveRoom, player, setSecret } = useGame();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SecretNumberFormData>({
    resolver: zodResolver(secretNumberSchema),
    defaultValues: {
      secret: '',
    },
  });

  if (!room || !player) return null;

  const currentPlayer = room.players.find((p) => p?.id === player.id);
  const otherPlayer = room.players.find((p) => p?.id !== player.id);

  // Check if current player has already set their secret
  const hasSetSecret = currentPlayer?.secret !== undefined;
  const otherHasSetSecret = otherPlayer?.secret !== undefined;

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

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Key className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configurar Secreto
          </h1>
          <p className="text-gray-600">Elige tu número secreto de 4 dígitos</p>
        </div>

        <Card>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                Estado de Jugadores
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="font-medium">
                  {currentPlayer?.username} (Tú)
                </span>
                <div className="flex items-center space-x-2">
                  {hasSetSecret ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 text-sm font-medium">
                        Listo
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-600 text-sm font-medium">
                        Pendiente
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="font-medium">{otherPlayer?.username}</span>
                <div className="flex items-center space-x-2">
                  {otherHasSetSecret ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 text-sm font-medium">
                        Listo
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-600 text-sm font-medium">
                        Pendiente
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {errors.secret && (
            <div className="mb-6">
              <ErrorAlert
                message={errors.secret.message || ''}
                onClose={() => {}}
              />
            </div>
          )}

          {!hasSetSecret ? (
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="space-y-6">
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
          ) : (
            <div className="text-center">
              <div className="bg-green-50 rounded-lg p-6 mb-4">
                <Check className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  ¡Secreto Configurado!
                </h3>
                <p className="text-green-600">
                  Ya estableciste tu número secreto. Esperando que{' '}
                  {otherPlayer?.username} configure el suyo.
                </p>
              </div>

              {otherHasSetSecret && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">
                    ¡Ambos jugadores están listos! El juego comenzará en
                    breve...
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="mt-8 space-y-4">
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

          <Button variant="danger" onClick={handleLeaveRoom} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Salir de la Sala
          </Button>
        </div>
      </div>
    </div>
  );
};
