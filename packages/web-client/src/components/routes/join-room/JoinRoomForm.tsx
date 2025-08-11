import { Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useGame } from '@/context/game';
import { joinRoomSchema, type JoinRoomFormData } from '@/schemas/room';

export const JoinRoomForm: React.FC = () => {
  const { joinRoom, isLoading, error } = useGame();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinRoomFormData>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      code: '',
      password: '',
      username: '',
    },
  });

  const onSubmitForm = async (data: JoinRoomFormData) => {
    const { data: joinedRoom, error } = await joinRoom(data);
    if (error) {
      return;
    }

    navigate(`/room/${joinedRoom.code}`);
  };

  return (
    <Card>
      <p className="text-red-500">{error}</p>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <Input
          label="Código de Sala"
          type="text"
          {...register('code')}
          error={errors.code?.message}
          placeholder="Ej: SALA2024"
          helperText="Código proporcionado por el creador de la sala"
        />

        <Input
          label="Contraseña"
          type="password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="Contraseña de la sala"
          helperText="Contraseña establecida por el creador"
        />

        <Input
          label="Tu Nombre"
          type="text"
          {...register('username')}
          error={errors.username?.message}
          placeholder="Ej: Jugador2"
          helperText="Nombre que verá tu oponente"
        />

        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          className="w-full"
          size="lg"
        >
          <Users className="h-5 w-5 mr-2" />
          {isLoading ? 'Uniéndose...' : 'Unirse a Sala'}
        </Button>
      </form>
    </Card>
  );
};
