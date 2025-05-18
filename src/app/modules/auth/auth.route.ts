import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { Validation } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();

router
    .route("/sign-in")
    .post(
        validateRequest(Validation.signInZodSchema),
        AuthController.SignIn
    )

router
    .route("/send-otp")
    .post(
        validateRequest(Validation.authEmailOTPZodSchema),
        AuthController.getOpt
    )

router
    .route("/verify-otp")
    .post(
        validateRequest(Validation.OTPZodSchema),
        AuthController.verifyOtp
    )

router
    .route("/change-password")
    .post(
        validateRequest(Validation.changePasswordZodSchema),
        AuthController.changePassword
    )

router
    .route("/logout")
    .delete(
        auth( USER_ROLES.USER, USER_ROLES.ADMIN ),
        AuthController.logout
    )

export const AuthRouter = router;