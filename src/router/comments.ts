import * as express from 'express'
import { CommentController } from '../controller/CommentController'

const router = express.Router()
router.post('/', CommentController.createComment)
router.get('/', CommentController.getComments)
router.get('/:id', CommentController.getComment)
router.put('/:id', CommentController.updateComment)
router.delete('/:id', CommentController.deleteComment)

export default router
