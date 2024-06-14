import { corsPermitidos } from '../config/config.js'

export const corsValidation = (req, res, next) => {
  const { origin } = req.headers

  if (!origin || corsPermitidos.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    next()
  } else {
    return res.status(403).json({ message: 'Error de CORS' })
  }
}
