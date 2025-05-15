import { Document, Types } from "mongoose";
import { POST_TYPE } from "../../../enums/post";

export interface IPost extends Document {
    type: "MUSIC" | "STORY";
    title: string;
    mentorName: string;
    targetedAge: number;
    duration: string;
    description: string;
    coverPhoto: string;
    mainFile: string;
    countryFlag: string;
    category: string;
    createdBy: Types.ObjectId;
}