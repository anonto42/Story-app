import { JwtPayload } from "jsonwebtoken"
import { User } from "../user/user.model"
import { story } from "./input.types"
import { Post } from "../post/post.model"
import ApiError from "../../../errors/ApiError"
import { StatusCodes } from "http-status-codes"
import { getSingleFilePath } from "../../../shared/getFilePath"
import { Request } from "express"

//Have to make some overview aggrigation for this
const OverView = async (
    payload: JwtPayload
) => {
    const admin = await User.isUserExist({_id: payload.userID})

    return admin
}

const uploadPost = async (
    payload: JwtPayload,
    data: story,
    {
        image,
        video
    }:{
        image: string,
        video: string
    }
) => {
    const admin = await User.isUserExist({_id: payload.userID});

    const file = {
        type: data.type,
        title: data.title,
        duration: data.duration,
        description: data.description,
        media: data.mainFile,
        coverPhoto: data.coverPhoto,
        category: data.category,
        createdBy: admin._id
    }
console.log("This log is from the files -> "+file)
    const createdPost = await Post.create(file);
    if (!createdPost) {
        throw new ApiError(StatusCodes.EXPECTATION_FAILED,"Somting was wrong on the post creation")
    };

    return createdPost
}

const doAPost = async (req: Request, user: any,{countryFlagPath,coverPhotoPath,mainFilePath}:any) => {
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


export const AdminService = {
    OverView,
    uploadPost,
    doAPost
}