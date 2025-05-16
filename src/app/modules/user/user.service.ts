import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { ACCOUNT_TYPE, USER_ROLES, USER_STSTUS } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IUser } from './user.interface';
import { User } from './user.model'; 
import { jwtHelper } from '../../../helpers/jwtHelper';
import { eduEmailRegex } from '../../../regex/user';

const createUserToDB = async (payload: Partial<IUser> ) => {
  let isEdu = false;

  if (payload.requestedAccountType === ACCOUNT_TYPE.STUDENT) {
    isEdu = eduEmailRegex.test(payload.email as string)
    if (!isEdu) {
      throw new ApiError(StatusCodes.BAD_REQUEST,"Your email account is not a educational email account so you can't create the student account")
    }
  }

  const userData = {
    name: payload.name,
    role: USER_ROLES.USER,
    contact: payload.contact,
    email: payload.email,
    password: payload.password,
    location: payload.location, 
    status: USER_STSTUS.ACTIVE,
    accountType: isEdu? ACCOUNT_TYPE.STUDENT : ACCOUNT_TYPE.REGULAR
  }
  
  const createUser = await User.create(userData);
  if (!createUser) { 
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  const Token = jwtHelper.createToken({userID: createUser._id.toString(),role: USER_ROLES.USER})

  return {user:{
    name: createUser.name,
    email: createUser.email,
    contact: createUser.contact,
    profile: createUser.profile,
    location: createUser.location
  },Token}
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { userID } = user;
  const isExistUser = await User.findById(userID).select("-password -accountType -createdAt -updatedAt -lastActive -otpVerification -freeVideo -subscription -__v");
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { userID } = user;
  const isExistUser = await User.findById(userID);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.profile) {
    unlinkFile(isExistUser.profile!);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: userID }, payload, {
    new: true,
  });

  return updateDoc;
};

const getCondition = async (
    payload: JwtPayload
) => {
  await User.isUserExist({ _id: payload.userID });
  const condition = await User.findOne({ role: USER_ROLES.ADMIN });
  if (!condition) {
    throw new ApiError(StatusCodes.NOT_FOUND,"Condition and condition was not founded!");
  }
  return condition.termsConditions || "";
}

const getPolicy = async (
    payload: JwtPayload
) => {
  await User.isUserExist({ _id: payload.userID });
  const condition = await User.findOne({ role: USER_ROLES.ADMIN });
  if (!condition) {
    throw new ApiError(StatusCodes.NOT_FOUND,"Privacy and policy was not founded!");
  }
  return condition.privacyPolicy || "";
}

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  getPolicy,
  getCondition
};
