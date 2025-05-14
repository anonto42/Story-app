import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AdminService } from "./admin.service";


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

export const AdminController = {
    OverView
}