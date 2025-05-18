import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import fs from "fs";
import { paymentFailed, paymentSuccess } from '../../../helpers/paymentResHelper';
import { ACCOUNT_TYPE } from '../../../enums/user';

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
    const {path, postID} = req.body;
    const filePath = req.query.path as string
    const isUser = await User.isUserExist({ _id: user.userID });

    if (isUser.accountType === ACCOUNT_TYPE.REGULAR) {
      if ( isUser.subscription.isSubscriped ) {
        if ( isUser.subscription.expireAT < new Date( Date.now() ) ){
          isUser.subscription.isSubscriped = false;
          await isUser.save()
          throw new ApiError(StatusCodes.GATEWAY_TIMEOUT,"Your subscription has ended. Please renew your plan to continue enjoying premium features.")
        }
      } else if (isUser.freeVideo.isAvailable) {
        if (!Number(isUser.freeVideo.limit)) {
          isUser.freeVideo.isAvailable = false;
          await isUser.save();
          throw new ApiError(StatusCodes.FORBIDDEN,"You’ve reached your free limit")
        }
      }
    }

    const history = isUser.subscription.enrolled.filter( e => e === postID );
    if (!history) {
      isUser.subscription.enrolled.push(postID);
      isUser.freeVideo.limit = Number(isUser.freeVideo.limit) > 0 ? Number(isUser.freeVideo.limit) - 1 : 0
      await isUser.save()
    }
    
    
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

const dataForFilter = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await UserService.categoryzeData(user)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully the categoryzed data!',
      data: result,
    });
  }
);

const dataForHome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const {...data} = req.body;
    const result = await UserService.dataForHome(user,data)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully get the data!',
      data: result,
    });
  }
);

const addToPlayList =  catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const postID = req.body.post_id;
    if (!postID) {
      throw new ApiError(StatusCodes.BAD_REQUEST,"You must give the content id to save in the playlist")
    }
    const result = await UserService.addToPlaylist(user,postID)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully added to the playlist.',
      data: result,
    });
  }
);

const getThePlaylist =  catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await UserService.getPlaylist(user)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully added to the playlist.',
      data: result,
    });
  }
);

const APost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const postID = req.query.id as string;
    const result = await UserService.aPostData(user,postID)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully get the post!',
      data: result,
    });
  }
);

const subscribe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const protocol = req.protocol;
    const host = req.headers.host;
    const alldata = req.body;
    const data = {
      protocol,
      host,
      ...alldata
    }
    const result = await UserService.subscribe(user,data)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully create the subscription!',
      data: result,
    });
  }
);

const subscribeFailed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const sessionId = req.query.session_id;
    // await UserService.subscribeFiled(user,sessionId as string)
    return res.send(paymentFailed)
  }
);

const subscribeSuccessfull = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.query.session_id
    await UserService.subscribeSuccessfull(sessionId as string)
    return res.send(paymentSuccess)
  }
);


export const UserController = { 
  createUser, 
  getUserProfile, 
  updateProfile,
  termsAndCondition,
  privacyAndPolicy,
  fileContains,
  filterPosts,
  subscribe,
  subscribeFailed,
  subscribeSuccessfull,
  APost,
  dataForHome,
  addToPlayList,
  getThePlaylist,
  dataForFilter
};
