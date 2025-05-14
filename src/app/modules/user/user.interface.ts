import { Model, Types } from 'mongoose';
import { USER_ROLES, USER_STSTUS, Verification_For } from '../../../enums/user';

export type IUser = {
  name: string;
  role: USER_ROLES;
  subscription: Types.ObjectId
  contact: string;
  email: string;
  password: string;
  location: string; 
  status: USER_STSTUS.ACTIVE | USER_STSTUS.DELETE;
  verified: boolean;
  profile?: string;
  otpVerification:{
    isVerified: {
      status:boolean,
      time: Date
    },
    otp: number,
    time: Date,
    verificationType:{
      type: string,
      enum: Verification_For,
    }
  },
  privacyPolicy:string,
  termsConditions:string,
};

export type UserModal = {
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
