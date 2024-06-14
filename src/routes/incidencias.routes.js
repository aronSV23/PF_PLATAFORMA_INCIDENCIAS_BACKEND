import { Router } from 'express'
import { actualizarIncidencia, cambiarEstado, crearIncidentes, obtenerEstados, obtenerIncidentesPorUsuario, obtenerTyposIncidencias, obtenerUnaIncidencia, todosLosIncidentes } from '../controllers/incidencias.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { esAdmin } from '../middlewares/esAdmin.middleware.js'
import { handleError, subirArchivos } from '../middlewares/multer.middleware.js'

const router = Router()

router.post('/', auth, subirArchivos.single('archivoIncidente'), handleError, crearIncidentes)
router.get('/', auth, obtenerIncidentesPorUsuario)
router.get('/incidencia/:incidenciaId', auth, obtenerUnaIncidencia)
router.patch('/incidencia/:incidenciaId', auth, subirArchivos.single('archivoIncidente'), handleError, actualizarIncidencia)
router.get('/todosLasIncidencias', auth, esAdmin, todosLosIncidentes)
router.patch('/estado/:incidenciaId', auth, esAdmin, cambiarEstado)
router.get('/tiposIncidencias', auth, obtenerTyposIncidencias)
router.get('/estadosIncidencias', auth, esAdmin, obtenerEstados)

export default router
