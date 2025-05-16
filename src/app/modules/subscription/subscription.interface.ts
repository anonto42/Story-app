import { Document, Types } from "mongoose"

export interface ISubscription extends Document{
    type: string;
    userID: Types.ObjectId;
    subscriptionPlanId: Types.ObjectId;
    packageName: string;
    packagePrice: number;
    date: Date;
    status: string;
    condition: string;
    subscriptionDuration: string;
}