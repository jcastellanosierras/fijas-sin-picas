import { useState } from 'react';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FormData {
  code: string;
  password: string;
  username: string;
}

interface JoinRoomFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

export const JoinRoomForm: React.FC<JoinRoomFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    code: '',
    password: '',
    username: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Código de Sala"
          type="text"
          value={formData.code}
          onChange={handleChange('code')}
          error={errors.code}
          placeholder="Ej: SALA2024"
          helperText="Código proporcionado por el creador de la sala"
        />

        <Input
          label="Contraseña"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          error={errors.password}
          placeholder="Contraseña de la sala"
          helperText="Contraseña establecida por el creador"
        />

        <Input
          label="Tu Nombre"
          type="text"
          value={formData.username}
          onChange={handleChange('username')}
          error={errors.username}
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
