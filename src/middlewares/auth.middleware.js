import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/config.js'

export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies

    if (!token) {
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' })
    }

    jwt.verify(token, SECRET_KEY, (error, user) => {
      if (error) {
        res.cookie('token', '', { expires: new Date(0) })
        return res.status(401).json({ message: 'Token is not valid' })
      }

      req.user = user
      next()
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
