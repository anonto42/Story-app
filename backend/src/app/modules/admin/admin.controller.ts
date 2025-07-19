import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AdminService } from "./admin.service";
import { getSingleFilePath } from "../../../shared/getFilePath";
import { User } from "../user/user.model";
import ApiError from "../../../errors/ApiError";


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

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const postID = req.query.id;
    if (!postID) {
      throw new ApiError(StatusCodes.BAD_REQUEST,"You must give the id to get the post")
    }
    const result = await AdminService.deleteApost(user,postID as string);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Post deleted successfully!',
      data: result,
    });
  }
);

const subScriptions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const id = req.query.id;
    let result;
    if (!id) {
      result = await AdminService.getAllSubscriptions(user);
    } else if ( id ) {
      result = await AdminService.ASubscription(user,id as string)
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully get all subscription',
      data: result,
    });
  }
);

const plans = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const id = req.query.id as string;
    let result;

    if (id) {
      result = await AdminService.getAPlans(user,id);
    }else{
      result = await AdminService.getAllPlans(user)
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully get subscription plans',
      data: result,
    });
  }
);

const createScriptions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const {...data} = req.body;
    const result = await AdminService.createSubscription(user,data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully create subscription',
      data: result,
    });
  }
);

const editeScriptions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const {...data} = req.body;
    const result = await AdminService.updateSubscription(user,data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully edited the subscription',
      data: result,
    });
  }
);

const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const id = req.query.id;
    let result;
    if (!id) {
      result = await AdminService.allUsers(user);
    } else if ( id ) {
      result = await AdminService.AUser(user,id as string)
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully get user',
      data: result,
    });
  }
);

const deletetUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const id = req.query.id;
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST,"You must give the id of the user to delete the user")
    }
    const result = await AdminService.deleteUser(user,id as string)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully delete the user',
      data: result,
    });
  }
);

const blockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const id = req.query.id;
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST,"You must give the id of the user to block the user")
    }
    const result = await AdminService.blockUser(user,id as string)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully block the user',
      data: result,
    });
  }
);

const privacyUpdate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { data } = req.body;
    const result = await AdminService.updatePrivacy(user,data)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully updated the privacy and policy',
      data: result,
    });
  }
);

const conditionUpdate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { data } = req.body;
    const result = await AdminService.updateCondition(user,data)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully updated the terms & condition',
      data: result,
    });
  }
);

export const AdminController = {
  OverView,
  makeAPost,
  deletePost,
  subScriptions,
  createScriptions,
  editeScriptions,
  getUser,
  blockUser,
  deletetUser,
  privacyUpdate,
  conditionUpdate,
  plans
}