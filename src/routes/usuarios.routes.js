import { Router } from 'express'
import { actualizarPerfil, cambiarRol, loginUsuario, logout, obtenerPerfil, obtenerRoles, registrarUsuario, todosLosUsuarios } from '../controllers/usuarios.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { esAdmin } from '../middlewares/esAdmin.middleware.js'
import { handleError, subirArchivos } from '../middlewares/multer.middleware.js'

const router = Router()

router.post('/login', loginUsuario)
router.post('/register', registrarUsuario)
router.get('/profile', auth, obtenerPerfil)
router.patch('/update', auth, subirArchivos.single('imagenPerfil'), handleError, actualizarPerfil)
router.get('/users', auth, esAdmin, todosLosUsuarios)
router.post('/logout', auth, logout)
router.patch('/role/:userId', auth, esAdmin, cambiarRol)
router.get('/roles', auth, esAdmin, obtenerRoles)

export default router
