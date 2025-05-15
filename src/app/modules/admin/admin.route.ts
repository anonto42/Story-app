import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidaton } from "./admin.validation";
import fileUploadHandler from "../../middlewares/fileUploadHandler";


const router = Router();

router
    .route("/")
    .get(
        auth( USER_ROLES.ADMIN ),
        AdminController.OverView
    )

router
    .route("/post")
    .post(
        auth(USER_ROLES.ADMIN),
        fileUploadHandler(),
        AdminController.makeAPost
    )
    .delete(
        auth( USER_ROLES.ADMIN ),
        AdminController.deletePost
    )



export const AdminRouter = router;