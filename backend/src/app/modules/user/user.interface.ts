import { Document, Model, Types } from 'mongoose';
import { ACCOUNT_TYPE, USER_ROLES, USER_STSTUS, Verification_For } from '../../../enums/user';

export interface IUser extends Document {
  _id: Types.ObjectId;
  playList: Types.ObjectId[];
  requestedAccountType: ACCOUNT_TYPE
  name: string;
  role: USER_ROLES;
  idVerifyed: boolean;
  subscription: {
    stripeCustomerID: string;
    limite: number;
    enrolled: Types.ObjectId[];
    isSubscriped: boolean;
    expireAT: Date;
    subscriptionID: string;
  };
  accountType: string;
  freeVideo:{
    isAvailable: boolean;
    lastWatchedAt?: Date;
    limit: Number;
  };
  contact: string;
  email: string;
  password: string;
  location: string; 
  status: string;
  verified: boolean;
  profile: string;
  lastActive: Date;
  otpVerification:{
    isVerified: {
      status:boolean,
      time: string
    },
    otp: number,
    time: Date,
    verificationType: string
  },
  privacyPolicy:string,
  termsConditions:string,
};

export type UserModal = {
  isMatchPassword(password: string, hashPassword: string): boolean;
  isUserExist( filter: object ): Promise<IUser>;
} & Model<IUser>;
