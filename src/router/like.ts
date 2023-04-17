import * as express from 'express'
import { LikeController } from '../controller/LikeController'

const router = express.Router()

router.get('/', LikeController.getLikes)
router.post('/:id', LikeController.updateLike)

export default router
