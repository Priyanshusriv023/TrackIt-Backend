import { Router } from "express"
import {
    createApplication,
    getUserApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
} from "../controllers/application.controllers.js"
import { validate } from "../middlewares/validator.middleware.js"
import {
    createApplicationValidator,
    updateApplicationValidator,
} from "../validators/index.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()


router.use(verifyJWT) 

router.route("/")
    .get(getUserApplications)
    .post(createApplicationValidator(), validate, createApplication)

router.route("/:applicationId")
    .get(getApplicationById)
    .patch(updateApplicationValidator(), validate, updateApplication)
    .delete(deleteApplication)

export default router
