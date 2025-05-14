import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { Validation } from './auth.validation';

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

export const AuthRouter = router;