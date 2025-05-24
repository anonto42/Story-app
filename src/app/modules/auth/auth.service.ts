import { StatusCodes } from "http-status-codes";
import { User } from "../user/user.model";
import { jwtHelper } from "../../../helpers/jwtHelper";
import ApiError from "../../../errors/ApiError";
import generateOTP from "../../../util/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import { compare, hash } from "bcryptjs";

const signIn = async ( 
    payload : {
        email: string,
        password: string
    }
) => {
    const { email, password } = payload;
    const isUser = await User.isUserExist({email});

    const isPassword = await User.isMatchPassword(password,isUser.password);

    if (
        !isPassword
    ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
    };

    const token = jwtHelper.createToken({role: isUser.role,userID: isUser._id.toString()});

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
    payload : { email: string, verificationType: "FORMAT_PASSWORD" | "CHANGE_PASSWORD" }
) => {
    const { email } = payload;
    const isUser = await User.isUserExist({email});
    
    // generate otp
    const otp = generateOTP();

    //Send Mail
    const forgetPassword = emailTemplate.sendMail({otp, email,name: isUser.name, subjet: payload.verificationType});
    emailHelper.sendEmail(forgetPassword);

    const token = await hash(otp.toString(), 1)
    
    await User.updateOne(
        { email },
        {
          $set: {
            'otpVerification.otp': otp,
            'otpVerification.time': token,
            'otpVerification.verificationType': payload.verificationType,
          },
        }
    );
      
    return { user:{ email: isUser.email }, token }
}

const verifyOtp = async (
    payload : { email: string, otp: string ,token: string}
) => {
    const { email, otp, token } = payload;
    const isUser = await User.isUserExist({email});

    const compareHash = await compare( otp,  token);
    
    if (!compareHash) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Your otp was wrong!"
        );
    };

    if (Number(otp) !== isUser.otpVerification.otp && !isUser.otpVerification.isVerified && !isUser.otpVerification.time ) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE,"Your otp verification in not acceptable for this moment!")
    };

    await User.findByIdAndUpdate({_id: isUser._id},{$set: {
        "otpVerification.isVerified.status": true,
        "otpVerification.isVerified.time": token
    }});

    await User.updateOne(
        { email },
        {
          $set: {
            'otpVerification.time': "",
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
        oparationType: string,
        token: string
    }
) => {
    const { email, currentPassword, password, confirmPassword, oparationType, token } = payload;
    const isUser = await User.isUserExist({email});

    if ( !isUser.otpVerification.isVerified.status ) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE,"Your verification date is over now you can't change the password!")
    };

    const tokenHased = await compare( isUser.otpVerification.otp.toString() , token );
    
    if (!tokenHased) {
        throw new ApiError(
            StatusCodes.NOT_ACCEPTABLE,
            "your token was wrong!"
        )
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
                "otpVerification.isVerified.time": "",
            }
        });

    };

    if ( oparationType === "FORGET_PASSWORD" ) {

        await User.findByIdAndUpdate(isUser._id, {
            $set:{
                password: password,
                "otpVerification.isVerified.status": false,
                "otpVerification.isVerified.time": "",
            }
        });
    };
      
    return true;
} 

const logOut = async ( 
    payload : {
        email: string,
        password: string
    }
) => {
    const { email, password } = payload;
    const isUser = await User.isUserExist({email});
}

export const AuthServices = {
    signIn,
    emailSend,
    verifyOtp,
    changePassword,
    logOut
}