import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import { USER_ROLES } from "../../../enums/user";
import config from "../../../config";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";

const SignIn = catchAsync(
    async( req: Request, res: Response ) => {
        const {...data} = req.body;
        const result = await AuthServices.signIn(data);

        if (result.user.role === USER_ROLES.ADMIN) {
            const expirDate = Number(config.jwt.jwt_expire_in!.split("")[0])
            return res
                    .cookie('authorization', result.token, {
                        httpOnly: true,
                        secure: config.node_env === 'production',
                        sameSite: 'strict',
                        maxAge: expirDate
                    })
                    .json({
                        sucess: true,
                        statusCode: StatusCodes.OK,
                        message: "Welcome to deshboard",
                        adminData:result
                    })
        }
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "User login successfully",
            data: result
        })
    }
)

const getOpt = catchAsync(
    async( req: Request, res: Response ) => {
        const {...data} = req.body;
        const result = await AuthServices.emailSend(data);

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: `An OTP has been sent to ${result.user.email}. Please check your inbox and continue!`,
            data: result
        })
    }
)

const verifyOtp = catchAsync(
    async( req: Request, res: Response ) => {
        const body = req.body;
        const token = req.headers.authorization!.split(" ")[1];
        const data = { ...body, token };
        const result = await AuthServices.verifyOtp(data);

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Your OTP is verifyed successfully now you can change your password!",
            data: result
        })
    }
)

const changePassword = catchAsync(
    async( req: Request, res: Response ) => {
        const token = req.headers.authorization?.split(" ")[1]
        const body = req.body;
        const data = { ...body, token };
        const result = await AuthServices.changePassword(data);

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Your pasword was changed successfully",
            data: result
        })
    }
)

const logout = catchAsync(
    async( req: Request, res: Response ) => {
        res.clearCookie('authorization', {
            httpOnly: true,
            secure: config.node_env === 'production',
            sameSite: 'strict',
        });

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Logout successful",
        });
    }
)

export const AuthController = {
    SignIn,
    getOpt,
    verifyOtp,
    changePassword,
    logout
}