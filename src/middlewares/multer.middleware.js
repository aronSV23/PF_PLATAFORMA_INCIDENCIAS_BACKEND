import crypto from 'crypto'
import fs from 'fs'
import multer from 'multer'

const profileDirectory = 'public/uploads/profile/'
const archivosIncidentesDirectory = 'public/uploads/archivos/'

const createCarpeta = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

createCarpeta(profileDirectory)
createCarpeta(archivosIncidentesDirectory)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'archivoIncidente') {
      cb(null, archivosIncidentesDirectory)
    } else if (file.fieldname === 'imagenPerfil') {
      cb(null, profileDirectory)
    } else {
      cb(new Error('Tipo de archivo no permitido'), false)
    }
  },
  filename: (req, file, cb) => {
    const extention = file.originalname.slice(file.originalname.lastIndexOf('.'))
    const nombre = crypto.randomUUID() + extention
    cb(null, nombre)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'imagenPerfil') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes'))
    }
  } else if (file.fieldname === 'archivoIncidente') {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos de imagen o video'))
    }
  }
}

export const subirArchivos = multer({
  storage,
  limits: { fileSize: 70 * 1024 * 1024 }, // Limitar el tamaño de archivo a 40MB
  fileFilter
})

// Función para manejar el error
export const handleError = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ errors: [{ path: err.field, message: 'El archivo debe pesar menos de 70 MB' }] })
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ errors: [{ path: err.field, message: 'Solo se permiten 3 archivos como maximo' }] })
  }
  return res.status(400).json({ errors: [{ path: 'file', message: err.message, code: err.code }] })
}
