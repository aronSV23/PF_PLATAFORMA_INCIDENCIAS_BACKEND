import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'node:fs/promises'
import path from 'node:path'
import { SECRET_KEY } from '../config/config.js'
import userModel from '../models/usuarios.model.js'
import { validatePartialUser, validateRole, validateUser, validatelogin } from '../schemas/usuario.js'

// Crear un nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    const result = validateUser(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      return res.status(400).json({ errors: errorMessages })
    }

    const userFoundByEmail = await userModel.profileDataByColum('correo', result.data.correo)
    const userFoundByUserName = await userModel.profileDataByColum('nombre_usuario', result.data.nombre_usuario)
    const userFoundByDni = await userModel.profileDataByColum('dni', result.data.dni)

    if (userFoundByEmail) { return res.status(400).json({ errors: [{ path: 'correo', message: 'El correo de usuario ya esta en uso' }] }) }
    if (userFoundByUserName) { return res.status(400).json({ errors: [{ path: 'nombre_usuario', message: 'El nombre de usuario ya esta en uso' }] }) }
    if (userFoundByDni) { return res.status(400).json({ errors: [{ path: 'dni', message: 'El dni ya esta en uso' }] }) }

    result.data.contraseña = await bcrypt.hash(result.data.contraseña, 10)

    const newUser = await userModel.createUser(result.data)

    if (!newUser) return res.status(500).json({ message: 'No se pudo crear el usuario' })

    const token = jwt.sign({ id: newUser.id }, SECRET_KEY, { expiresIn: '1h' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 // 1 hora
    })
    return res.status(201).json({ message: 'Usuario registrado con éxito', data: newUser })
  } catch (error) {
    // Corroborar si el error se debe a una entrada duplicada (correo)
    if (error?.errno === 1062) return res.status(400).json({ message: 'Credenciales duplicadas' })

    return res.status(500).json({ message: 'Error al registrar usuario', error })
  }
}

// Iniciar sesión del usuario
export const loginUsuario = async (req, res) => {
  try {
    const result = validatelogin(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      return res.status(400).json({ errors: errorMessages })
    }

    // Corroborar que el usuario exista en la base de datos
    const usuario = await userModel.profileDataByColum('correo', result.data.correo)

    if (!usuario) return res.status(400).json({ message: 'Credenciales inválidas' })

    // Comparar la contraseña encripatada con la entrada del usuario en esta petición
    const isValidPassword = await bcrypt.compare(result.data.contraseña, usuario.contraseña)

    if (!isValidPassword) return res.status(400).json({ message: 'Credenciales incorrectas' })

    const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: '1h' })

    const infoUsuario = await userModel.profileDataById(usuario.id)

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 // 1 hora
    })
    return res.status(201).json({ data: infoUsuario })
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error })
  }
}

// Obtener la informacion del usuario
export const obtenerPerfil = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await userModel.profileDataById(userId)

    if (user.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' })

    return res.status(201).json({ data: user })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Actualizar datos del usuario
export const actualizarPerfil = async (req, res) => {
  try {
    const result = validatePartialUser(req.body)
    const userId = req.user.id

    const prevUserData = await userModel.profileDataById(userId)

    if (!prevUserData) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      if (req.file) await fs.unlink(path.normalize(`public/uploads/profile/${req.file.filename}`))
      return res.status(400).json({ errors: errorMessages })
    }

    if (result.data.correo) {
      const userFoundByEmail = await userModel.profileDataByColum('correo', result.data.correo)
      if (userFoundByEmail && prevUserData.correo !== result.data.correo) {
        if (req.file) await fs.unlink(path.normalize(`public/uploads/profile/${req.file.filename}`))
        return res.status(400).json({ errors: [{ path: 'correo', message: 'El correo de usuario ya esta en uso' }] })
      }
    }

    if (result.data.nombre_usuario) {
      const userFoundByUserName = await userModel.profileDataByColum('nombre_usuario', result.data.nombre_usuario)
      if (userFoundByUserName && prevUserData.nombre_usuario !== result.data.nombre_usuario) {
        if (req.file) await fs.unlink(path.normalize(`public/uploads/profile/${req.file.filename}`))
        return res.status(400).json({ errors: [{ path: 'nombre_usuario', message: 'El nombre de usuario ya esta en uso' }] })
      }
    }

    if (result.data.dni) {
      const userFoundByDni = await userModel.profileDataByColum('dni', result.data.dni)
      if (userFoundByDni && prevUserData.dni !== result.data.dni) {
        if (req.file) await fs.unlink(path.normalize(`public/uploads/profile/${req.file.filename}`))
        return res.status(400).json({ errors: [{ path: 'dni', message: 'El dni ya esta en uso' }] })
      }
    }

    if (result.data.contraseña) {
      result.data.contraseña = await bcrypt.hash(result.data.contraseña, 10)
    }

    if (req.file) {
      result.data.foto_perfil = req.file.filename
    }

    const userUpdate = await userModel.updateUser(userId, result.data)

    if (userUpdate) {
      if (prevUserData.foto_perfil !== 'defaultProfilePicture.jpg') {
        await fs.unlink(path.normalize(`public/uploads/profile/${prevUserData.foto_perfil}`))
      }
      return res.status(200).json({ message: 'Usuario actualizado exitosamente', data: userUpdate })
    }

    if (req.file) await fs.unlink(path.normalize(`public/uploads/profile/${req.file.filename}`))
    return res.status(404).json({ message: 'Error al modificar el registro' })
  } catch (error) {
    if (req.file) await fs.unlink(path.normalize(`public/uploads/profile/${req.file.filename}`))
    res.status(500).json({ message: 'Error al actualizar usuario', error })
  }
}

export const todosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await userModel.getAllProfiles()

    return res.status(200).json({ data: usuarios })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const logout = async (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0)
  })
  return res.sendStatus(200)
}

export const cambiarRol = async (req, res) => {
  try {
    const result = validateRole(req.body)
    const { userId } = req.params

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      return res.status(400).json({ errors: errorMessages })
    }

    const usuarioAActulizar = await userModel.profileDataById(userId)

    if (!usuarioAActulizar) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const role = await userModel.getRoleByName(result.data.role)

    if (!role) {
      return res.status(404).json({ message: 'Role no encontrado en la base de datos' })
    }

    const dataAActualizar = { rol_id: role.id }

    const userUpdate = await userModel.updateUser(userId, dataAActualizar)

    if (userUpdate) {
      return res.status(200).json({ message: 'Usuario actualizado exitosamente', data: userUpdate })
    }

    return res.status(404).json({ message: 'Error al modificar el registro' })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error })
  }
}

export const obtenerRoles = async (req, res) => {
  try {
    const estados = await userModel.getAllRols()

    const newArray = estados.map(item => item.nombre_rol)
    return res.status(200).json({ data: newArray })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
