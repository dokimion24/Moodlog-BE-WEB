import { Router } from 'express'
import { upload } from '../util/upload'
import { UserController } from '../controller/UserController'
import { AuthMiddleware } from '../middleware/AuthMiddleware'

const routes = Router()

routes.get('/register', UserController.getUsers)
routes.post('/register', upload.single('img'), UserController.register)
routes.get('/login', UserController.login)
routes.get('/logout', UserController.logout)

export default routes
