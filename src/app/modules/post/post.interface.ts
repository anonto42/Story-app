import { Document, Types } from "mongoose";
import { POST_TYPE } from "../../../enums/post";

export interface IPost extends Document {
    type: POST_TYPE;
    title: string;
    singerName: string;
    targetedAge: number;
    duration: string;
    description: string;
    coverPhoto: string;
    mainFile: string;
    language: string;
    category: string;
    views: number;
    createdBy: Types.ObjectId;
}