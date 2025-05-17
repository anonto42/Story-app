import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import Stripe from 'stripe';
import config from '../../../config';
const router = express.Router();
export const { customers, checkout } = new Stripe(config.strip_secret_key as string)

router
  .route('/')
  .get(
    auth( USER_ROLES.USER, USER_ROLES.ADMIN ),
    UserController.getUserProfile
  )
  .post(
    validateRequest(UserValidation.createUserZodSchema),
    UserController.createUser
  )
  .put(
    auth( USER_ROLES.ADMIN, USER_ROLES.USER ),
    fileUploadHandler(),
    UserController.updateProfile
  )

router
  .route("/subscribe")
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    validateRequest( UserValidation.subscription ),
    UserController.subscribe
  )

router
  .route('/subscribe-success')
  .get(
    UserController.subscribeSuccessfull
  )

router
  .route('/subscribe-failed')
  .get(
    UserController.subscribeFailed
  )


router
  .route("/policy")
  .get(
    auth( USER_ROLES.ADMIN, USER_ROLES.USER ),
    UserController.privacyAndPolicy
  )

router
  .route("/terms")
  .get(
    auth( USER_ROLES.ADMIN, USER_ROLES.USER ),
    UserController.termsAndCondition
  )

router
  .route('/files')
  .get(
    auth( USER_ROLES.USER, USER_ROLES.ADMIN ),
    UserController.fileContains
  )

router
  .route('/filter')
  .get(
    auth( USER_ROLES.USER, USER_ROLES.ADMIN ),
    UserController.filterPosts
  )

router
  .route('/post')
  .get(
    auth( USER_ROLES.USER, USER_ROLES.ADMIN ),
    UserController.APost
  )

export const UserRoutes = router;
