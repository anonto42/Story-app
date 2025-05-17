import { POST_TYPE } from "../../../enums/post"
import { SUBSCRIPTION_DURATION_TIME } from "../../../enums/subscription";


export type story = {
    type: POST_TYPE;
    title: string;
    mentorName: string;
    category: string;
    targetedAge: number;
    duration: number;
    description: string;
    coverPhoto: string;
    mainFile: string;
    countryFlag: string;
}

export type Subscription = {
    id?: string;
    description: string;
    subscriptionDuration: SUBSCRIPTION_DURATION_TIME;
    packagePrice: number;
    packageName: string;
}