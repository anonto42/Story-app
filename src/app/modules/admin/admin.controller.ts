import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AdminService } from "./admin.service";
import { getSingleFilePath } from "../../../shared/getFilePath";
import { User } from "../user/user.model";


const OverView = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await AdminService.OverView(user);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully get deshboard overview data',
      data: result,
    });
  }
);

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const countryFlag = getSingleFilePath(req.files,"image")
    // const coverPhoto = getSingleFilePath(req.files,"image")
    const mainFile = getSingleFilePath(req.files,"media")

    // const data = {
    //   mainFile,
    //   coverPhoto,
    //   countryFlag,
    //   ...req.body
    // }
    const result = await AdminService.uploadPost(user,req.body,{image: countryFlag!, video: mainFile!});

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully get deshboard overview data',
      data: result,
    });
  }
);

const makeAPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    await User.isUserExist(user._id)
    const coverPhotoPath = getSingleFilePath(req.files, 'image');
    const mainFilePath = getSingleFilePath(req.files, 'media');
    const countryFlagPath = getSingleFilePath(req.files, 'flage');

    const result = await AdminService.doAPost(req, req,{countryFlagPath,coverPhotoPath,mainFilePath});

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Post created successfully',
      data: result,
    });
  }
);



export const AdminController = {
  OverView,
  createPost,
  makeAPost
}