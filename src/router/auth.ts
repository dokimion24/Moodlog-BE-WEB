import { Router } from 'express'
import { upload } from '../util/upload'
import { UserController } from '../controller/UserController'
import { AuthMiddleware } from '../middleware/AuthMiddleware'

const routes = Router()

routes.get('/user', AuthMiddleware.verifyToken, UserController.getUser)
routes.post('/register', upload.single('img'), UserController.register)
routes.post('/login', UserController.login)
routes.post('/logout', UserController.logout)
routes.delete('/withdrawal', AuthMiddleware.verifyToken, UserController.withdrawal)
routes.put('/update', AuthMiddleware.verifyToken, upload.single('img'), UserController.updateProfile)

export default routes
