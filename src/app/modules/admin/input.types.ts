import { POST_TYPE } from "../../../enums/post"


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