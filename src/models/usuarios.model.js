import { pool } from '../config/db.js'

const profileDataByColum = async (columna, valor) => {
  const [usuario] = await pool.execute(`
    SELECT BIN_TO_UUID(u.id) id, u.nombre_usuario, u.nombre_completo, u.dni, u.correo, u.contraseña, u.telefono, r.nombre_rol AS role, u.foto_perfil, u.fecha_creacion 
    FROM usuarios u INNER JOIN roles r ON u.rol_id = r.id WHERE u.${columna} = ?`, [valor])

  return usuario?.length === 0 ? undefined : usuario[0]
}

const profileDataById = async (id) => {
  const [usuario] = await pool.execute(`
      SELECT BIN_TO_UUID(u.id) id, u.nombre_usuario, u.nombre_completo, u.dni, u.correo, u.telefono, r.nombre_rol AS role, u.foto_perfil, u.fecha_creacion 
      FROM usuarios u INNER JOIN roles r ON u.rol_id = r.id WHERE u.id = UUID_TO_BIN(?)`, [id])

  return usuario?.length === 0 ? undefined : usuario[0]
}

const getAllProfiles = async () => {
  const [usuario] = await pool.execute(`
      SELECT BIN_TO_UUID(u.id) id, u.nombre_usuario, u.nombre_completo, u.dni, u.correo, u.telefono, r.nombre_rol AS role, u.foto_perfil, u.fecha_creacion 
      FROM usuarios u INNER JOIN roles r ON u.rol_id = r.id`)

  return usuario
}

const getAllRols = async () => {
  const [roles] = await pool.execute('SELECT nombre_rol FROM roles;')

  return roles
}

const getRoleByName = async (name) => {
  const [role] = await pool.execute(`
        SELECT id
        FROM roles WHERE nombre_rol = ?`, [name])

  return role?.length === 0 ? undefined : role[0]
}

const createUser = async (user) => {
  const [uuidResult] = await pool.query('SELECT UUID() uuid;')
  const [{ uuid }] = uuidResult

  user.id = uuid

  const query = 'INSERT INTO usuarios (id, nombre_usuario, nombre_completo, dni, correo, contraseña) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?)'
  const [result] = await pool.execute(query, [uuid, user.nombre_usuario, user.nombre_completo, user.dni, user.correo, user.contraseña])

  // Corroborar que se ha insertado el nuevo registro
  if (result.affectedRows === 1) {
    // Traer los datos del usuario registrado para enviarlo
    const newUser = await profileDataById(uuid)
    return newUser
  }

  return undefined
}

const updateUser = async (id, updatedFields) => {
  const keys = Object.keys(updatedFields)
  const values = Object.values(updatedFields)

  // Construir la consulta dinámicamente
  const setClause = keys.map(key => `${key} = ?`).join(', ')
  const query = `UPDATE usuarios SET ${setClause} WHERE id = UUID_TO_BIN(?)`

  // Agregar el ID al final del array de valores
  values.push(id)

  const [result] = await pool.execute(query, values)
  if (result.affectedRows <= 0) {
    return undefined
  }
  const userUpdateData = await profileDataById(id)
  return userUpdateData
}

export default { getAllRols, createUser, updateUser, profileDataByColum, getAllProfiles, getRoleByName, profileDataById }
