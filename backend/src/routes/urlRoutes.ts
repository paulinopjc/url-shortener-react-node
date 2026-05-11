import { Router } from 'express'
import * as urlController from '../controllers/urlController'

const router = Router()

router.post('/', urlController.create)
router.get('/', urlController.getAll)
router.get('/:id', urlController.getOne)
router.delete('/:id', urlController.remove)
router.get('/:id/clicks', urlController.getClicks)

export default router
