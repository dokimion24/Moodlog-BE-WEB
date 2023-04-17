import { Router } from 'express'
import { upload } from '../util/upload'
import { UserController } from '../controller/UserController'
import { AuthMiddleware } from '../middleware/AuthMiddleware'

const routes = Router()

routes.get('/register', UserController.getUsers)
routes.post('/register', upload.single('img'), UserController.register)
routes.post('/login', UserController.login)
routes.post('/logout', UserController.logout)
routes.delete('/withdrawal', UserController.withdrawal)
routes.put('/update', upload.single('img'), UserController.updateProfile)

export default routes
