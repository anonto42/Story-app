import { Document, Types } from "mongoose"
import { SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPE } from "../../../enums/subscription"

export interface ISubscription extends Document{
    type: SUBSCRIPTION_TYPE;
    userID: Types.ObjectId;
    subscriptionPlanId: Types.ObjectId;
    packageName: string;
    packagePrice: number;
    date: Date;
    status: SUBSCRIPTION_STATUS;
    condition: string;
}