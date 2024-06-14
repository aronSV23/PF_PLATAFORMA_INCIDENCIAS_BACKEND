import { z } from 'zod'

const userSchema = z.object({
  nombre_usuario: z.string({
    required_error: 'Nombre de usuario requerido'
  }),
  nombre_completo: z.string({
    required_error: 'Nombre completo requerido'
  }),
  dni: z.string({
    required_error: 'Nombre completo requerido'
  }).trim().min(8),
  correo: z
    .string({
      required_error: 'Correo requerido'
    })
    .email({
      message: 'Correo no valido'
    }),
  contraseña: z
    .string({
      required_error: 'Contraseña requerida'
    })
    .min(8, {
      message: 'La contraseña debe contener almenos 8 caracteres'
    })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/, {
      message: 'La contraseña debe contener mayusculas, minusculas y numeros'
    }),
  telefono: z.string().trim().optional()
})

export const loginSchema = z.object({
  correo: z
    .string({
      required_error: 'Correo requerido'
    })
    .email({
      message: 'Correo no valido'
    }),
  contraseña: z.string({
    required_error: 'Contraseña requerida'
  }).min(8, {
    message: 'La contraseña debe contener almenos 8 caracteres'
  })
})

// Validar datos del usuario
const validateUser = (data) => userSchema.safeParse(data)

// Validar datos parciales del usuario
const validatePartialUser = (data) => userSchema.partial().safeParse(data)

// Validar datos del usuario en login
const validatelogin = (data) => loginSchema.safeParse(data)

const validateRole = (data) => z.object({ role: z.enum(['administrador', 'residente']) }).safeParse(data)

export { validatePartialUser, validateRole, validateUser, validatelogin }
