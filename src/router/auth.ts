import { Router } from 'express'
import { upload } from '../util/upload'
import { UserController } from '../controller/UserController'

const routes = Router()

routes.get('/register', UserController.getUsers)
routes.post('/register', upload.single('img'), UserController.register)
routes.get('/login', UserController.login)

export default routes
