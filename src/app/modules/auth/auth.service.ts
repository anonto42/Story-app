import { StatusCodes } from "http-status-codes";
import { User } from "../user/user.model";
import { jwtHelper } from "../../../helpers/jwtHelper";
import { USER_ROLES } from "../../../enums/user";
import ApiError from "../../../errors/ApiError";
import generateOTP from "../../../util/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";

const signIn = async ( 
    payload : {
        email: string,
        password: string
    }
) => {
    const { email, password } = payload;
    const isUser = await User.findOne({email});
    if (!isUser) {
        throw new ApiError(StatusCodes.NOT_FOUND,"Your account is not exist!")
    };
    if ( isUser.status === "DELETE" ) {
        throw new ApiError(StatusCodes.FORBIDDEN,`Your account was ${isUser.status.toLowerCase()}!`)
    };

    const isPassword = User.isMatchPassword(password,isUser.password)

    if (
        !isPassword
    ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
    };

    const token = jwtHelper.createToken({role: USER_ROLES.USER,userID: isUser._id.toString()});

    return { token, user: {
        name: isUser.name,
        email: isUser.email,
        profile: isUser.profile,
        role: isUser.role,
        contact: isUser.contact,
        status: isUser.status
    } }
}

const emailSend = async (
    payload : { email: string, verificationType: "FORMAT_PASSWORD" | "CHANGE_PASSWORD" | "ACCOUNT_VERIFICATION" }
) => {
    const { email } = payload;
    const isUser = await User.findOne({email});
    if (!isUser) {
        throw new ApiError(StatusCodes.NOT_FOUND,`No account exists with this ( ${email} ) email`)
    };

    if ( isUser.status === "DELETE" ) {
        throw new ApiError(StatusCodes.FORBIDDEN,`Your account was ${isUser.status.toLowerCase()}!`)
    };
    
    // generate otp
    const otp = generateOTP();

    //Send Mail
    const forgetPassword = emailTemplate.sendMail({otp, email,name: isUser.name, subjet: payload.verificationType});
    emailHelper.sendEmail(forgetPassword);

    await User.updateOne(
        { email },
        {
          $set: {
            'otpVerification.otp': otp,
            'otpVerification.time': new Date(Date.now() + 3 * 60000),
            'otpVerification.verificationType': payload.verificationType,
          },
        }
    );
      
    return true
}

const verifyOtp = async (
    payload : { email: string, otp: string }
) => {
    const { email, otp } = payload;
    const isUser = await User.findOne({email});
    if (!isUser) {
        throw new ApiError(StatusCodes.NOT_FOUND,`No account exists with this ( ${email} ) email`)
    };

    if ( isUser.status === "DELETE" ) {
        throw new ApiError(StatusCodes.FORBIDDEN,`Your account was ${isUser.status.toLowerCase()}!`)
    };

    if (Number(otp) !== isUser.otpVerification.otp && !isUser.otpVerification.isVerified && isUser.otpVerification.time < new Date( Date.now() )) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE,"Your otp verification in not acceptable for this moment!")
    };

    await User.findByIdAndUpdate({_id: isUser._id},{$set: {
        "otpVerification.isVerified.status": true,
        "otpVerification.isVerified.time": new Date(Date.now() + 10 * 60 * 1000)
    }});

    await User.updateOne(
        { email },
        {
          $set: {
            'otpVerification.otp': 0,
            'otpVerification.time': new Date(),
            'otpVerification.verificationType': ""
          },
        }
    );
      
    return true;
}

const changePassword = async (
    payload : {
        email: string, 
        currentPassword: string, 
        password: string, 
        confirmPassword: string, 
        oparationType: string
    }
) => {
    const { email, currentPassword, password, confirmPassword, oparationType } = payload;
    const isUser = await User.findOne({email});
    if (!isUser) {
        throw new ApiError(StatusCodes.NOT_FOUND,`No account exists with this ( ${email} ) email`)
    };
    if ( isUser.status === "DELETE" ) {
        throw new ApiError(StatusCodes.FORBIDDEN,`Your account was ${isUser.status.toLowerCase()}!`)
    };
    if ( !isUser.otpVerification.isVerified.status ) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE,"Your verification date is over now you can't change the password!")
    };
    
    if ( isUser.otpVerification.isVerified.time < new Date( Date.now())  ) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE,"Your verification date is over now you can't change the password!")
    };
    
    if (password !== confirmPassword) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE,"Please check your new password and the confirm password!")
    };

    if ( oparationType === "CHANGE_PASSWORD" ) {
        
        const isCurrentPasswordValid = await User.isMatchPassword(currentPassword, isUser.password)
        if (!isCurrentPasswordValid) {
            throw new ApiError(StatusCodes.BAD_REQUEST,"You have gived the wrong old password!")
        };

        await User.findByIdAndUpdate(isUser._id, {
            $set:{
                password: password,
                "otpVerification.isVerified.status": false,
                "otpVerification.isVerified.time": new Date( 0 ),
            }
        });

    };

    if ( oparationType === "FORGET_PASSWORD" ) {

        await User.findByIdAndUpdate(isUser._id, {
            $set:{
                password: password,
                "otpVerification.isVerified.status": false,
                "otpVerification.isVerified.time": new Date( 0 ),
            }
        });
    };
      
    return true;
} 

export const AuthServices = {
    signIn,
    emailSend,
    verifyOtp,
    changePassword
}