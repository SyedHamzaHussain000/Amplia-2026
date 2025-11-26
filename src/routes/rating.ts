import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import { validate } from "../middleware/validate";
import { RatingValidation } from "../validations/rating";
import { RatingController } from "../controllers/rating";

const router = Router()

router.route('/')
    .post(IsAuth.users, validate(RatingValidation.createRating), RatingController.createRating)

router.route('/:ratingId')
    .patch(IsAuth.users, validate(RatingValidation.updateRating), RatingController.updateRating)
    .delete(IsAuth.users, RatingController.deleteRating)
    .get(IsAuth.everyone , RatingController.getRating)
export default router
