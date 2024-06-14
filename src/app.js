import cookieParser from 'cookie-parser'
import express from 'express'
import morgan from 'morgan'
import { corsValidation } from './middlewares/cors.middleware.js'
import incidenciaRoute from './routes/incidencias.routes.js'
import userRoute from './routes/usuarios.routes.js'

const app = express()

app.use(corsValidation)
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use('/profile', express.static('public/uploads/profile'))
app.use('/archivos', express.static('public/uploads/archivos'))

app.use('/api/usuario', userRoute)
app.use('/api/reporte', incidenciaRoute)

app.use((req, res, next) => {
  res.status(404).json({ message: 'End point not found' })
})

export default app
