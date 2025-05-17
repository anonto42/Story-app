import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import path from "path";
import fs from "fs";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let profile = getSingleFilePath(req.files, 'image');

    const data = {
      profile,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const termsAndCondition = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await UserService.getCondition(user)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully get the terms & condition',
      data: result,
    });
  }
);

const privacyAndPolicy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await UserService.getPolicy(user)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully get the privacy & policy',
      data: result,
    });
  }
);

const fileContains = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const filePath = req.query.path as string
    const isUser = await User.isUserExist({ _id: user.userID });
    
    if (!filePath) {
      throw new ApiError(StatusCodes.BAD_REQUEST,"You must give the file path to take the file")
    };
    
    const pathDir = path.join(process.cwd(),"uploads", filePath);

    if (!fs.existsSync(pathDir)) {
      throw new ApiError(StatusCodes.NOT_FOUND,"This contant file is not exist!")
    };

    const stat = fs.statSync(pathDir);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      res.writeHead(200,{
        "content-length": fileSize,
        "content-type": getMimeType(pathDir)
      });
      fs.createReadStream(pathDir).pipe(res);
    }else{
      const paths = range.replace(/bytes=/,"").split("-");
      const start = parseInt(paths[0],10);
      const end = paths[1] ? parseInt(paths[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(pathDir,{ start, end});

      res.writeHead(206,{
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': getMimeType(pathDir),
      });

      file.pipe(res);

    }

    function getMimeType(filePath: string) {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.mp4') return 'video/mp4';
      if (ext === '.mp3') return 'audio/mpeg';
      if (ext === '.webm') return 'video/webm';
      return 'application/octet-stream';
    }
  }
);

const filterPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const {...data} = req.body;
    const result = await UserService.filterData(user,data)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully filtered the responce!',
      data: result,
    });
  }
);


export const UserController = { 
  createUser, 
  getUserProfile, 
  updateProfile,
  termsAndCondition,
  privacyAndPolicy,
  fileContains,
  filterPosts
};
