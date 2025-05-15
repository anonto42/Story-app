import { model, Schema } from 'mongoose';
import { IPost } from './post.interface';

const postSchema = new Schema<IPost>(
  {
    type: {
        type: String,
        trim: true,
        enum: ["MUSIC", "STORY"]
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
