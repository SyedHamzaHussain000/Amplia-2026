import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import { validate } from "../middleware/validate";
import { BookingValidation } from "../validations/booking";
import { BookingController } from "../controllers/booking";

const router = Router()

router.route('/')
    .post(IsAuth.users, validate(BookingValidation.create), BookingController.create)
    .get(IsAuth.everyone, BookingController.getBooking)

router.route('/:id')
    .patch(IsAuth.admins, validate(BookingValidation.updateStatus), BookingController.updateStatus)
    .delete(IsAuth.everyone, BookingController.delete)
    .get(IsAuth.everyone, BookingController.getBooking)

router.route('/:id/assign')
    .put(IsAuth.everyone, BookingController.assign) // IsAuth.everyone allows logged in users (including subAdmins) to access. We might want to restrict to subAdmins/admins later, but isAuth.everyone ensures they are logged in.

export default router
