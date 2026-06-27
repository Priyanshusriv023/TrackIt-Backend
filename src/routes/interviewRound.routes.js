import { Router } from "express"
import {
    addInterviewRound,
    getInterviewRounds,
    updateInterviewRound,
    deleteInterviewRound
} from "../controllers/interviewRound.controllers.js"
import { validate } from "../middlewares/validator.middleware.js"
import {
    addInterviewRoundValidator,
    updateInterviewRoundValidator
} from "../validators/index.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/:applicationId/rounds")
    .get(getInterviewRounds)
    .post(addInterviewRoundValidator(), validate, addInterviewRound)

router.route("/:applicationId/rounds/:roundId")
    .patch(updateInterviewRoundValidator(), validate, updateInterviewRound)
    .delete(deleteInterviewRound)

export default router