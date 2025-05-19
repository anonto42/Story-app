import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { ACCOUNT_TYPE, USER_ROLES, USER_STSTUS, Verification_For } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IUser, UserModal } from './user.interface';

const userSchema = new Schema<IUser, UserModal>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
    },
    playList:[{
      type: Schema.Types.ObjectId,
      ref: "post"
    }],
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    contact:{
      type: String
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profile: {
      type: String,
      default: 'https://i.ibb.co/z5YHLV9/profile.png',
    },
    status: {
      type: String,
      enum: [USER_STSTUS.ACTIVE,USER_STSTUS.BLOCK],
      default: USER_STSTUS.ACTIVE,
    },
    accountType:{
      type: String,
      enum: ACCOUNT_TYPE,
      default: ACCOUNT_TYPE.REGULAR
    },
    location:{
      type: String
    },
    subscription: {
      isSubscriped: {
        type: Boolean,
        default: false
      },
      expireAT: {
        type: Date
      },
      limite: Number,
      enrolled: [{
        type: Schema.Types.ObjectId,
      }],
      stripeCustomerID: String,
      subscriptionID: Schema.Types.ObjectId
    },
    lastActive:{
      type: Date,
      default: new Date( Date.now() )
    },
    freeVideo:{
      isAvailable: {
        type:Boolean,
        default: true
      },
      lastWatchedAt:{
        type: Date
      },
      limit:{
        type: Number,
        default: 1
      }
    },
    otpVerification:{
      isVerified: {
        status:{
          type: Boolean,
          default: false
        },
        time: Date
      },
      otp: Number,
      time: Date,
      verificationType:{
        type: String,
        enum: Verification_For,
      }
    },
    privacyPolicy:{
      type: String,
      trim: true
    },
    termsConditions:{
      type: String,
      trim: true
    },
  },
  { timestamps: true }
);

//is match password
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

userSchema.statics.isUserExist = async ( payload: object ): Promise<IUser> => {
  const user = await User.findOneAndUpdate(
    payload,
    { lastActive: new Date( Date.now() ) },
    { new: true }
  );
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND,"User not exist!")
  };
  if ( user.status === "BLOCK" ) {
    throw new ApiError(StatusCodes.FORBIDDEN,`Your account was ${user.status.toLowerCase()}!`)
  };
  return user
};

userSchema.pre('save', async function (next) {
  // Only hash the password if it's new or has been modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  // Don't check for existing email if it's not a new document
  if (this.isNew) {
    const isExist = await User.findOne({ email: this.email });
    if (isExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
    }
  }

  next();
});

export const User = model<IUser, UserModal>('user', userSchema);
