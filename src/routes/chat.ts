import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import { ChatController } from "../controllers/chat";
import { validate } from "../middleware/validate";
import { ChatValidation } from "../validations/chat";
import upload from "../middleware/multerConfig";

const router = Router()

router.route('/')
    .post(IsAuth.users, ChatController.create)
    .get(IsAuth.admins, validate(ChatValidation.get) , ChatController.get)

router.route('/:id')
    .post(IsAuth.everyone, upload.fields([
        { name: "media", maxCount: 10 },
        { name: "messageFile", maxCount: 10 }
    ]), ChatController.sendMessage)
    .patch(IsAuth.admins, validate(ChatValidation.updateStatus), ChatController.updateStatus)
    .get(IsAuth.everyone, ChatController.get)

router.route('/message')
    .patch(IsAuth.everyone, ChatController.markSeen)


export default router

// test
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTI0ZWFkZWU5OWMzNDNmZDNjNDM2MjgiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NjQ3ODkwMDYsImV4cCI6MTc2NTM5MzgwNn0.MgyT2md32vqZvW0C0KAIJ2l2lHevvWoP5M6C1VKYAgU

// test2
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTI3NGE5N2Q0YzkwNjg2MGM4ZDY5M2UiLCJlbWFpbCI6InRlc3QyQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY0ODAxMzMwLCJleHAiOjE3NjU0MDYxMzB9.KNxya71pCpFF_Sxk3HILdc2i-2k8xnJB2amzFcvGjE0

// admin
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTI0ZTRkYmQzOWEwMjE3Y2NjZmI3ODEiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJzdXBlckFkbWluIiwiaWF0IjoxNzY0NzkxNjQ1LCJleHAiOjE3NjUzOTY0NDV9.COnXQ4CY_v9rmM_ueCj85GqHSyDJlcsmE_XX40lG65s

// subadmin
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTI1ZGZjZGIxZmY3ZWMxZmY2OThiMmEiLCJlbWFpbCI6InN1YmFkbWluMkBnbWFpbC5jb20iLCJyb2xlIjoic3ViQWRtaW4iLCJpYXQiOjE3NjQ3OTE3NzQsImV4cCI6MTc2NTM5NjU3NH0.GPl9jzE0fulHJEW8WjtoXvVFq5Qq43gf5mbytnQ2Gfk