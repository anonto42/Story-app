import { model, Schema } from 'mongoose';
import { ISubscription } from './subscription.interface';
import { SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPE } from '../../../enums/subscription';

const subscriptionSchema = new Schema<ISubscription>(
  {
    type: {
      type: String,
      enum: SUBSCRIPTION_TYPE
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    subscriptionPlanId: {
      type: Schema.Types.ObjectId,
      ref: "subscription"
    },
    packageName: {
      type: String
    },
    packagePrice: {
      type: Number
    },
    date: {
      type: Date
    },
    status: {
      type: String,
      enum: SUBSCRIPTION_STATUS
    },
    condition: {
      type: String,
      min: 30
    }
  },
  { timestamps: true }
);

export const Subscription = model<ISubscription>('subscription', subscriptionSchema);
