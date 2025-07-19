import { model, Schema } from 'mongoose';
import { IPost } from './post.interface';
import { LANGUAGE, POST_TYPE } from '../../../enums/post';

const postSchema = new Schema<IPost>(
  {
    type: {
        type: String,
        trim: true,
        enum: POST_TYPE
    },
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    singerName: {
        type: String,
        required: true
    },
    targetedAge: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coverPhoto: {
        type: String,
        required: true
    },
    mainFile: {
        type: String,
        required: true
    },
    language: {
        type: String,
        enum: LANGUAGE,
        default: LANGUAGE.ENGLISH
    },
    views:[{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
  },
  { timestamps: true }
);

export const Post = model<IPost>('post', postSchema);
