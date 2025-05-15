import { Document, Model, Types } from 'mongoose';
import { USER_ROLES, USER_STSTUS, Verification_For } from '../../../enums/user';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  role: USER_ROLES;
  subscription: {
    isSubscriped: boolean;
    expireAT: Date;
  };
  contact: string;
  email: string;
  password: string;
  location: string; 
  status: USER_STSTUS.ACTIVE | USER_STSTUS.DELETE;
  verified: boolean;
  profile?: string;
  lastActive: Date;
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
  isUserExist( filter: object ): Promise<IUser>;
} & Model<IUser>;
