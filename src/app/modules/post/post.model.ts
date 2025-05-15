import { model, Schema } from 'mongoose';
import { IPost } from './post.interface';
import { POST_TYPE } from '../../../enums/post';

const postSchema = new Schema<IPost>(
  {
    type: {
        type: String,
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
    mentorName: {
        type: String,
        required: true
    },
    targetedAge: {
        type: Number,
        required: true
    },
    storyTime: {
        type: Number,
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
    countryFlag: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
  },
  { timestamps: true }
);

export const Post = model<IPost>('post', postSchema);
