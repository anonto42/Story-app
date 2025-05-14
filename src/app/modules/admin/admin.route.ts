import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { AdminController } from "./admin.controller";


const router = Router();

router
    .route("/")
    .get(
        auth( USER_ROLES.ADMIN ),
        AdminController.OverView
    )


export const AdminRouter = router;