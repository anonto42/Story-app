import { JwtPayload } from "jsonwebtoken"
import { User } from "../user/user.model"
import { story, Subscription as typeOfSub } from "./input.types"
import { Post } from "../post/post.model"
import ApiError from "../../../errors/ApiError"
import { StatusCodes } from "http-status-codes"
import { Request } from "express"
import unlinkFile from "../../../shared/unlinkFile"
import { Subscription } from "../subscription/subscription.model"
import { USER_ROLES, USER_STSTUS } from "../../../enums/user"

//Have to make some overview aggrigation for this
const OverView = async (
    payload: JwtPayload
) => {
    const admin = await User.isUserExist({_id: payload.userID})

    return admin
}

const doAPost = async (
    req: Request, 
    user: any,
    {
        countryFlagPath,
        coverPhotoPath,
        mainFilePath
    }:any
) => {
  const {
    type,
    category,
    title,
    mentorName,
    targetedAge,
    duration,
    description,
  } = req.body;

 
  // Validate required files
  if (!coverPhotoPath || !mainFilePath || !countryFlagPath) {
    throw new Error('All required files (coverPhoto, media, countryFlag) must be uploaded.');
  }

  // Create the Post
  const post = await Post.create({
    type: type.toString(),
    category,
    title,
    mentorName,
    targetedAge,
    duration,
    description,
    coverPhoto: coverPhotoPath,
    mainFile: mainFilePath,
    countryFlag: countryFlagPath,
    createdBy: user._id,
  });

  return post;
};

const deleteApost = async (
    payload: JwtPayload,
    postId: string
) => {
    await User.isUserExist({_id: payload});
    if (!postId) {
        throw new ApiError(StatusCodes.BAD_REQUEST,"You must give the post id to delete the post")
    };
    const postDelete = await Post.findById(postId);
    if (!postDelete) {
        throw new ApiError(StatusCodes.NOT_FOUND,"Post dosn't exist!")
    };

    unlinkFile(postDelete.countryFlag!);
    unlinkFile(postDelete.mainFile!);    
    unlinkFile(postDelete.coverPhoto!);

    return true;
}

const getAllSubscriptions = async ( payload: JwtPayload) => {
    await User.isUserExist(payload.userID)
    return await Subscription.find()
        .populate('userID', 'name')
        .sort({ createdAt: -1 })
        .lean();
};

const ASubscription = async ( payload: JwtPayload, id: string ) => {
    await User.isUserExist({_id: payload.userID });

      const subscription = await Subscription.findById(id)
        .populate('userID', 'name email') // Full user info (adjust fields as needed)
        .populate('subscriptionPlanId') // Full plan info
        .lean();

    return subscription
}

const createSubscription = async (
    payload: JwtPayload,
    data: typeOfSub
) => {
    const Admin = await User.isUserExist({_id: payload._id});

}

const updateSubscription = async (
    payload: JwtPayload,
    data: typeOfSub
) => {
    const Admin = await User.isUserExist({_id: payload._id});

}

const allUsers = async (paylaod: JwtPayload) => {
    await User.isUserExist({_id: paylaod._id})

    return User.find().select("-password")
}

const AUser = async (paylaod: JwtPayload, id: string) => {
    await User.isUserExist({_id: paylaod._id})
    return User.isUserExist({_id: id})
}

const deleteUser = async (payload: JwtPayload, id: string) => {
    await User.isUserExist({_id: payload._id})

    const user = await User.findByIdAndDelete(id).select("-password");
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND,"User not founded!")
    }
    return user
}

const blockUser = async (payload: JwtPayload, id: string) => {
    await User.isUserExist({_id: payload._id})

    const user = await User.findOneAndUpdate({_id: id},{ status: USER_STSTUS.BLOCK }).select("-password");
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND,"User not founded!")
    }
    return user
}

const updatePrivacy = async (
    payload: JwtPayload,
    text: string
) => {
    await User.isUserExist({ _id: payload.userID });

    const privacy = await User.findOne({ role: USER_ROLES.ADMIN });
    if (!privacy) {
        throw new ApiError(StatusCodes.NOT_FOUND,"Admin model not founded for update!");
    }

    privacy.privacyPolicy = text;
    await privacy.save();

    return true;
}

const updateCondition = async (
    payload: JwtPayload,
    text: string
) => {
    await User.isUserExist({ _id: payload.userID });

    const condition = await User.findOne({ role: USER_ROLES.ADMIN });
    if (!condition) {
        throw new ApiError(StatusCodes.NOT_FOUND,"Admin model not founded for update!");
    }

    condition.termsConditions = text;
    await condition.save();

    return true;
}


export const AdminService = {
    OverView,
    doAPost,
    deleteApost,
    getAllSubscriptions,
    ASubscription,
    createSubscription,
    updateSubscription,
    allUsers,
    AUser,
    deleteUser,
    blockUser,
    updatePrivacy,
    updateCondition
}