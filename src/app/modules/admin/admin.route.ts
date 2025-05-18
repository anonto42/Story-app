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

router
    .route("/subscription")
    .get(
        auth( USER_ROLES.ADMIN ),
        AdminController.subScriptions
    )
    .post(
        auth( USER_ROLES.ADMIN ),
        validateRequest( AdminValidaton.createSubZodModel ),
        AdminController.createScriptions
    )
    .put(
        auth( USER_ROLES.ADMIN ),
        validateRequest( AdminValidaton.updateSchemaZod ),
        AdminController.editeScriptions
    )

router
    .route("/plans")
    .get(
        auth( USER_ROLES.ADMIN, USER_ROLES.USER ),
        AdminController.plans
    )

router
    .route("/users")
    .get(
        auth( USER_ROLES.ADMIN ),
        AdminController.getUser
    )
    .patch(
        auth( USER_ROLES.ADMIN ),
        AdminController.blockUser
    )
    .delete(
        auth( USER_ROLES.ADMIN ),
        AdminController.deletetUser
    )

router
    .route("/terms")
    .put(
        auth(USER_ROLES.ADMIN),
        validateRequest( AdminValidaton.policyZodSchema),
        AdminController.privacyUpdate
    )
    .patch(
        auth( USER_ROLES.ADMIN ),
        validateRequest( AdminValidaton.conditionsZodSchema ),
        AdminController.conditionUpdate
    )



export const AdminRouter = router;