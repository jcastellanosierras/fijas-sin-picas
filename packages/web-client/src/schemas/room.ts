import { z } from 'zod';

export const createRoomSchema = z.object({
  code: z
    .string()
    .min(4, 'El código debe tener al menos 4 caracteres')
    .max(50, 'El código no puede tener más de 50 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'El código solo puede contener letras y números'),
  password: z
    .string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres'),
  username: z
    .string()
    .min(4, 'El nombre debe tener al menos 4 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-Z0-9\s]+$/, 'El nombre solo puede contener letras, números y espacios'),
});

export const joinRoomSchema = z.object({
  code: z
    .string()
    .min(4, 'El código debe tener al menos 4 caracteres')
    .max(50, 'El código no puede tener más de 50 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'El código solo puede contener letras y números'),
  password: z
    .string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres'),
  username: z
    .string()
    .min(4, 'El nombre debe tener al menos 4 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-Z0-9\s]+$/, 'El nombre solo puede contener letras, números y espacios'),
});

export const secretNumberSchema = z.object({
  secret: z
    .string()
    .min(4, 'El número debe tener exactamente 4 dígitos')
    .max(4, 'El número debe tener exactamente 4 dígitos')
    .regex(/^\d{4}$/, 'Solo se permiten números de 4 dígitos'),
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
export type JoinRoomFormData = z.infer<typeof joinRoomSchema>;
export type SecretNumberFormData = z.infer<typeof secretNumberSchema>;
