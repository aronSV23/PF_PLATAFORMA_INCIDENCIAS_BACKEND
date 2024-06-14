import app from './app.js'
import { PORT } from './config/config.js'

app.listen(PORT, () => console.log(`
Server running on http://localhost:${PORT}
Docs running on http://localhost:${PORT}/doc
`))

/* import { z } from 'zod'

const data = { tipo_incidencia_id: 'administrador' }

const validateRole = (data) => z.object({
  tipo_incidencia_id: z
    .enum(['Fontanería', 'Electricidad', 'Seguridad', 'Mantenimiento', 'Higiene y limpieza', 'Pisos y estructura', 'Transporte y estacionamiento', 'Gestión de residuos', 'Gestión de emergencias', 'Otras'], {
      required_error: 'Tipo de incidencia requerida'
    })
}).safeParse(data)

const result = validateRole(data)

console.log(result)
if (!result.success) {
  console.log(result.error)
} else {
  console.log(result.data)
}
 */
/*
import { pool } from './config/db.js'

const getAllProfiles = async () => {
  const [usuario] = await pool.execute(`
        SELECT foto_perfil
        FROM usuarios u INNER JOIN roles r ON u.rol_id = r.id`)

  const newArray = usuario.map(item => item.foto_perfil)

  console.log(newArray)
}

getAllProfiles()
 */
/*
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

// Validar datos parciales del usuario
const validarParcialIncidente = (data) => incidenciaSchema.partial().safeParse(data)

const datos = {
  asunto: 'hola',
  descripcion: 'mundo'
}

const result = validarParcialIncidente(datos)

console.log(result)
if (!result.success) {
  console.log(result.error)
} else {
  console.log(result.data)
}
 */
/*
const data = {
  asunto: 'hola',
  descripcion: 'mundo'
}

const keys = Object.keys(data)

// Construir la consulta dinámicamente
const setClause = keys.map(key => `${key} = ?`).join(', ')

console.log(setClause)
 */
/* import { pool } from './config/db.js'

const getAllInsidents = async () => {
  const [usuario] = await pool.execute(`
        SELECT BIN_TO_UUID(i.id) id, i.asunto, ti.nombre_incidencias, i.descripcion, i.ubicacion_incidencia, u.nombre_usuario, e.nombre_estado, i.archivo_imagen, i.fecha_creacion
        FROM incidencias i INNER JOIN tipos_incidencias ti ON i.tipo_incidencia_id = ti.id
        INNER JOIN estados e ON i.estado_id = e.id
        INNER JOIN usuarios u ON i.residente_id = u.id`)

  return usuario
}

const getAllProfiles = async () => {
  const [usuario] = await pool.execute(`
        SELECT BIN_TO_UUID(u.id) id, u.nombre_usuario, u.nombre_completo, u.dni, u.correo, u.telefono, r.nombre_rol AS role, u.foto_perfil, u.fecha_creacion
        FROM usuarios u INNER JOIN roles r ON u.rol_id = r.id`)

  return usuario?.length === 0 ? undefined : usuario
}

console.log(await getAllInsidents())
console.log(await getAllProfiles())
 */
/* import { pool } from './config/db.js'

const insidentByUserId = async (id) => {
  const [usuario] = await pool.execute(`
      SELECT BIN_TO_UUID(i.id) id, i.asunto, ti.nombre_incidencias, i.descripcion, i.ubicacion_incidencia, u.nombre_usuario, e.nombre_estado, i.archivo_imagen, i.fecha_creacion
        FROM incidencias i INNER JOIN tipos_incidencias ti ON i.tipo_incidencia_id = ti.id
        INNER JOIN estados e ON i.estado_id = e.id
        INNER JOIN usuarios u ON i.residente_id = u.id WHERE u.id = UUID_TO_BIN(?)`, [id])

  return usuario
}

const getUsersByRole = async (rol) => {
  const [usuario] = await pool.execute(`
SELECT BIN_TO_UUID(u.id) id, u.nombre_usuario, u.nombre_completo, u.dni, u.correo, u.contraseña, u.telefono, r.nombre_rol AS role, foto_perfil, fecha_creacion
FROM usuarios u INNER JOIN roles r ON u.rol_id = r.id WHERE u.id = UUID_TO_BIN(?)`, [rol])

  return usuario
}
const getTipo = async (name) => {
  const [tipo] = await pool.execute('SELECT id FROM tipos_incidencias WHERE nombre_incidencias = ?', [name])
  const tipo_incidencia_id = tipo[0].id

  console.log(tipo_incidencia_id)
}

const getRoleByName = async (name) => {
  const [role] = await pool.execute(`
          SELECT id
          FROM roles WHERE nombre_rol = ?`, [name])

  return role?.length === 0 ? undefined : role[0]
}

console.log(await insidentByUserId('1d22c638-29ed-11ef-a913-f02f744ad29a'))
console.log(await getUsersByRole('6fbee375-29e9-12ef-a913-f02f744ad29a'))
console.log(await getRoleByName('administrador'))

if (!(await insidentByUserId('1d22c638-29ed-11ef-a913-f02f744ad29a'))) {
  console.log('exist')
}

getTipo('Electricidad')
 */
