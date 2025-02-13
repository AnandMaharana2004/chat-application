import { Router } from 'express'
import { analyseCode } from '../controllers/aiController.js'

const router = Router()

router.route("/analyse-code").post(analyseCode)

export default router