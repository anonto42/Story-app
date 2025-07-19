import path from "path";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import config from "../../../config";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// Setup Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export async function processVideoWithSubtitles(localFilePath:any) {
  try {
    const filePath = path.join(process.cwd(), "uploads", localFilePath);
    
    const name = `${uuidv4()}-${Date.now()}`;
    
     await cloudinary.uploader.upload(filePath, {
        public_id: `${name}`,
        resource_type: 'video',
        raw_convert: 'google_speech:srt:vtt'
    });
    
    const videoUrl = cloudinary.url(name, {
      resource_type: 'video',
      overlay:{
        resource_type: "subtitles",
        public_id: `${name}.transcript`
      }
    });

    return videoUrl.split("?")[0]+".mp4"
    return videoUrl.split("?")[0]+".mp4"+"?"+videoUrl.split("?")[1]

  } catch (err) {
    console.error("Error processing video with subtitles:", err);
    throw err;
  }
}
