import { Router } from "express"
import { getDashboardStats } from "../controllers/analytics.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/dashboard").get(getDashboardStats)

export default router