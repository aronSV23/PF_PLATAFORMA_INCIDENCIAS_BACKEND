import userModel from '../models/usuarios.model.js'

export const esAdmin = async (req, res, next) => {
  try {
    const user = await userModel.profileDataById(req.user.id)

    if (user.role !== 'administrador') {
      return res.status(401).json({ message: 'Credenciales invalidas, autorizacion denegada' })
    }

    next()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
