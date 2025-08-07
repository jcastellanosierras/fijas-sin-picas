import { useNavigate } from 'react-router';
import { Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useGame } from '@/context/game';
import { createRoomSchema, type CreateRoomFormData } from '@/schemas/room';

export const CreateRoomForm: React.FC = () => {
  const { createRoom, isLoading, error } = useGame();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      code: '',
      password: '',
      username: '',
    },
  });

  const onSubmitForm = async (data: CreateRoomFormData) => {
    const { data: newRoom, error } = await createRoom(data);
    if (error) {
      return;
    }

    navigate(`/room/${newRoom.code}`);
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
          helperText="Código único que compartirás con tu oponente"
        />

        <Input
          label="Contraseña"
          type="password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="Contraseña segura"
          helperText="Protege tu sala con una contraseña"
        />

        <Input
          label="Tu Nombre"
          type="text"
          {...register('username')}
          error={errors.username?.message}
          placeholder="Ej: Jugador1"
          helperText="Nombre que verá tu oponente"
        />

        <Button
          type="submit"
          variant="success"
          loading={isLoading}
          className="w-full"
          size="lg"
        >
          <Users className="h-5 w-5 mr-2" />
          {isLoading ? 'Creando...' : 'Crear Sala'}
        </Button>
      </form>
    </Card>
  );
};
