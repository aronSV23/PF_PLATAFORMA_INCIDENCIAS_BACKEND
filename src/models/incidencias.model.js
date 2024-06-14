import { pool } from '../config/db.js'

const insidentByUserId = async (id) => {
  const [incidents] = await pool.execute(`
    SELECT BIN_TO_UUID(i.id) id, i.asunto, ti.nombre_incidencias, i.descripcion, i.ubicacion_incidencia, u.nombre_usuario, e.nombre_estado, i.archivo_imagen, i.fecha_creacion 
      FROM incidencias i INNER JOIN tipos_incidencias ti ON i.tipo_incidencia_id = ti.id
      INNER JOIN estados e ON i.estado_id = e.id
      INNER JOIN usuarios u ON i.residente_id = u.id WHERE u.id = UUID_TO_BIN(?)`, [id])

  return incidents
}

const insidentById = async (id) => {
  const [usuario] = await pool.execute(`
      SELECT BIN_TO_UUID(i.id) id, i.asunto, ti.nombre_incidencias, i.descripcion, i.ubicacion_incidencia, u.nombre_usuario, e.nombre_estado, i.archivo_imagen, i.fecha_creacion 
      FROM incidencias i INNER JOIN tipos_incidencias ti ON i.tipo_incidencia_id = ti.id
      INNER JOIN estados e ON i.estado_id = e.id
      INNER JOIN usuarios u ON i.residente_id = u.id WHERE i.id = UUID_TO_BIN(?)`, [id])

  return usuario?.length === 0 ? undefined : usuario[0]
}

const getAllInsidents = async () => {
  const [incidents] = await pool.execute(`
      SELECT BIN_TO_UUID(i.id) id, i.asunto, ti.nombre_incidencias, i.descripcion, i.ubicacion_incidencia, u.nombre_usuario, e.nombre_estado, i.archivo_imagen, i.fecha_creacion 
      FROM incidencias i INNER JOIN tipos_incidencias ti ON i.tipo_incidencia_id = ti.id
      INNER JOIN estados e ON i.estado_id = e.id
      INNER JOIN usuarios u ON i.residente_id = u.id`)

  return incidents
}

const getStateByName = async (name) => {
  const [estado] = await pool.execute(`
        SELECT id FROM estados WHERE nombre_estado = ?`, [name])

  return estado?.length === 0 ? undefined : estado[0]
}

const createInsident = async (data, residenteId) => {
  const [uuidResult] = await pool.query('SELECT UUID() uuid;')
  const [{ uuid }] = uuidResult
  const [tipo] = await pool.execute('SELECT id FROM tipos_incidencias WHERE nombre_incidencias = ?', [data.tipo_incidencia_id])
  data.tipo_incidencia_id = tipo[0].id

  const keys = Object.keys(data)
  const values = Object.values(data)

  // Construir la consulta dinámicamente
  const setClause = keys.map(key => `${key} = ?`).join(', ')
  const query = `INSERT INTO incidencias SET ${setClause}, residente_id =  UUID_TO_BIN(?), id = UUID_TO_BIN(?)`

  // Agregar el ID al final del array de valores
  values.push(residenteId)
  values.push(uuid)

  const [result] = await pool.execute(query, values)

  // Corroborar que se ha insertado el nuevo registro
  if (result.affectedRows === 1) {
    // Traer los datos del usuario registrado para enviarlo
    const newUser = await insidentById(uuid)
    return newUser
  }

  return undefined
}

const updateInsident = async (id, updatedFields) => {
  if (updatedFields.tipo_incidencia_id) {
    const [tipo] = await pool.execute('SELECT id FROM tipos_incidencias WHERE nombre_incidencias = ?', [updatedFields.tipo_incidencia_id])
    updatedFields.tipo_incidencia_id = tipo[0].id
  }

  const keys = Object.keys(updatedFields)
  const values = Object.values(updatedFields)

  // Construir la consulta dinámicamente
  const setClause = keys.map(key => `${key} = ?`).join(', ')
  const query = `UPDATE incidencias SET ${setClause} WHERE id = UUID_TO_BIN(?)`

  // Agregar el ID al final del array de valores
  values.push(id)

  const [result] = await pool.execute(query, values)
  if (result.affectedRows <= 0) {
    return undefined
  }
  const userUpdateData = await insidentById(id)
  return userUpdateData
}

const getAllTypeInsidents = async () => {
  const [incidentTypes] = await pool.query('SELECT nombre_incidencias FROM tipos_incidencias')

  return incidentTypes
}

const getAllStates = async () => {
  const [incidentTypes] = await pool.query('SELECT nombre_estado FROM estados;')

  return incidentTypes
}

export default { insidentByUserId, insidentById, getAllInsidents, getStateByName, createInsident, updateInsident, getAllTypeInsidents, getAllStates }
