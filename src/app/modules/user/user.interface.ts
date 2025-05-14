import { Model } from 'mongoose';
import { USER_ROLES, Verification_For } from '../../../enums/user';

export type IUser = {
  name: string;
  role: USER_ROLES;
  contact: string;
  email: string;
  password: string;
  location: string; 
  status: 'active' | 'delete';
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
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
