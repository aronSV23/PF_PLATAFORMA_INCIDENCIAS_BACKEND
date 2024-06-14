import fs from 'node:fs/promises'
import path from 'node:path'
import incidenciaModel from '../models/incidencias.model.js'
import userModel from '../models/usuarios.model.js'
import { validarEstado, validarIncidente, validarParcialIncidente } from '../schemas/incidencia.js'

export const crearIncidentes = async (req, res) => {
  try {
    const result = validarIncidente(req.body)
    const userId = req.user.id

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      if (req.file) await fs.unlink(path.normalize(`public/uploads/archivos/${req.file.filename}`))
      return res.status(400).json({ errors: errorMessages })
    }

    if (req.file) {
      result.data.archivo_imagen = req.file.filename
    }

    const newIncidencia = await incidenciaModel.createInsident(result.data, userId)

    if (!newIncidencia) return res.status(500).json({ message: 'No se pudo crear la incidencia' })

    return res.status(201).json({ message: 'Incidencia registrada con éxito', data: newIncidencia })
  } catch (error) {
    if (req.file) await fs.unlink(path.normalize(`public/uploads/archivos/${req.file.filename}`))
    return res.status(500).json({ message: 'Error al registrar incidencia', error })
  }
}

export const obtenerIncidentesPorUsuario = async (req, res) => {
  try {
    const userId = req.user.id

    const incidencias = await incidenciaModel.insidentByUserId(userId)

    return res.status(200).json({ data: incidencias })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const obtenerUnaIncidencia = async (req, res) => {
  try {
    const { incidenciaId } = req.params

    const incidente = await incidenciaModel.insidentById(incidenciaId)

    if (!incidente) return res.status(404).json({ message: 'Incidencia no encontrada' })

    return res.status(200).json({ data: incidente })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const actualizarIncidencia = async (req, res) => {
  try {
    const { incidenciaId } = req.params
    const result = validarParcialIncidente(req.body)
    const userId = req.user.id

    const prevData = await incidenciaModel.insidentById(incidenciaId)
    const user = await userModel.profileDataById(userId)
    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      if (req.file) await fs.unlink(path.normalize(`public/uploads/archivos/${req.file.filename}`))
      return res.status(400).json({ errors: errorMessages })
    }

    if (!prevData) {
      if (req.file) await fs.unlink(path.normalize(`public/uploads/archivos/${req.file.filename}`))
      return res.status(404).json({ message: 'Incidencia no encontrada' })
    }

    if (prevData.nombre_usuario !== user.nombre_usuario) {
      if (req.file) await fs.unlink(path.normalize(`public/uploads/archivos/${req.file.filename}`))
      return res.status(401).json({ message: 'Credenciales invalidas, autorizacion denegada' })
    }

    if (req.file) {
      result.data.archivo_imagen = req.file.filename
    }

    const incidenciaActualizada = await incidenciaModel.updateInsident(incidenciaId, result.data)

    if (!incidenciaActualizada) {
      if (req.file) await fs.unlink(path.normalize(`public/uploads/archivos/${req.file.filename}`))
      return res.status(500).json({ message: 'No se pudo actualizar la incidencia' })
    }

    if (prevData.archivo_imagen) await fs.unlink(path.normalize(`public/uploads/archivos/${prevData.archivo_imagen}`))
    return res.status(201).json({ message: 'Incidencia actualizada con éxito', data: incidenciaActualizada })
  } catch (error) {
    if (req.file) await fs.unlink(path.normalize(`public/uploads/archivos/${req.file.filename}`))
    return res.status(500).json({ message: 'Error al actualizar la incidencia', error })
  }
}

export const todosLosIncidentes = async (req, res) => {
  try {
    const incidencias = await incidenciaModel.getAllInsidents()

    return res.status(200).json({ data: incidencias })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const cambiarEstado = async (req, res) => {
  try {
    const { incidenciaId } = req.params
    const result = validarEstado(req.body)

    const prevData = await incidenciaModel.insidentById(incidenciaId)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      return res.status(400).json({ errors: errorMessages })
    }

    if (!prevData) {
      return res.status(404).json({ message: 'Incidencia no encontrada' })
    }

    const estadoId = await incidenciaModel.getStateByName(result.data.estado)

    if (!estadoId) {
      return res.status(404).json({ message: 'Estado no encontrado en la base de datos' })
    }

    const dataAActualizar = { estado_id: estadoId.id }

    const userUpdate = await incidenciaModel.updateInsident(incidenciaId, dataAActualizar)

    if (userUpdate) {
      return res.status(200).json({ message: 'Estado actualizado exitosamente', data: userUpdate })
    }

    return res.status(404).json({ message: 'Error al modificar el estado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado', error })
  }
}

export const obtenerTyposIncidencias = async (req, res) => {
  try {
    const incidencias = await incidenciaModel.getAllTypeInsidents()

    const newArray = incidencias.map(item => item.nombre_incidencias)
    return res.status(200).json({ data: newArray })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const obtenerEstados = async (req, res) => {
  try {
    const estados = await incidenciaModel.getAllStates()

    const newArray = estados.map(item => item.nombre_estado)
    return res.status(200).json({ data: newArray })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
