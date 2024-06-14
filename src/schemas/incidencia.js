import { z } from 'zod'

const incidenciaSchema = z.object({
  asunto: z.string({
    required_error: 'Asunto requerido'
  }),
  tipo_incidencia_id: z
    .enum(['Fontanería', 'Electricidad', 'Seguridad', 'Mantenimiento', 'Higiene y limpieza', 'Pisos y estructura', 'Transporte y estacionamiento', 'Gestión de residuos', 'Gestión de emergencias', 'Otras']),
  ubicacion_incidencia: z.string({
    required_error: 'Ubicacion de incidente requerida'
  }).trim(),
  descripcion: z
    .string({
      required_error: 'Descripcion requerida'
    }).trim()
})

// Validar datos del usuario
const validarIncidente = (data) => incidenciaSchema.safeParse(data)

// Validar datos parciales del usuario
const validarParcialIncidente = (data) => incidenciaSchema.partial().safeParse(data)

const validarEstado = (data) => z.object({ estado: z.enum(['Resuelto', 'Error, faltan datos', 'Resuelto']) }).safeParse(data)

export { validarEstado, validarIncidente, validarParcialIncidente }
