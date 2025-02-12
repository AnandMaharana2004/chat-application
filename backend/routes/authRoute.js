import { Router } from "express"

import { auth_verify } from "../middleware/AuthMiddleware.js"
import {
    Login,
    ForgetPassword,
    Register,
    ResetPassword,
    Loglout,
    ResetAccessTOken
} from '../controllers/authController.js'

const router = Router()

router.route("/register").post(Register)
router.route("/login").post(Login)
router.route("/forgot-password").post(ForgetPassword)
router.route("/logout").get(auth_verify, Loglout)
router.route("/reset-access-token").get( ResetAccessTOken)
router.route("/reset-password").put(auth_verify, ResetPassword)


export default router