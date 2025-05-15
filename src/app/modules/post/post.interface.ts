import { Document, Types } from "mongoose";
import { POST_TYPE } from "../../../enums/post";

export interface IPost extends Document {
    type: POST_TYPE;
    title: string;
    mentorName: string;
    targetedAge: number;
    storyTime: number;
    description: string;
    coverPhoto: string;
    mainFile: string;
    countryFlag: string;
    category: string;
    createdBy: Types.ObjectId;
}