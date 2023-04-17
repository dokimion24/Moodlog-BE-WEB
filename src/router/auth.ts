import { Router } from 'express'
import { upload } from '../util/upload'
import { UserController } from '../controller/UserController'

const routes = Router()

routes.post('/register', upload.single('img'), UserController.register)

export default routes
