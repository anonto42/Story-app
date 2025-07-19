import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import { USER_ROLES } from '../enums/user';

const createToken = (payload: {
  userID: string,
  role: USER_ROLES.USER | USER_ROLES.ADMIN
}): string => {
  const secret = config.jwt.jwt_secret;
  const expiresIn = config.jwt.jwt_expire_in;

  if (!secret || !expiresIn) {
    throw new ApiError(
      StatusCodes.FAILED_DEPENDENCY,
      'JWT_SECRET or JWT_EXPIRE_IN is not defined in environment variables.'
    );
  }

  const options: any = {
    expiresIn: expiresIn,
  };

  return jwt.sign(payload, secret as jwt.Secret, options);
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = { createToken, verifyToken };
