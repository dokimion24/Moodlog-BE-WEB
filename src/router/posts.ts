import * as express from 'express'
import { PostController } from '../controller/PostController'
import { upload } from '../util/upload'

const router = express.Router()

router.get('/', PostController.getPosts)
router.get('/:id', PostController.getPost)
router.post('/', upload.single('img'), PostController.createPost)
router.put('/:id', upload.single('img'), PostController.updatePost)
router.delete('/:id', PostController.deletePost)

export default router
