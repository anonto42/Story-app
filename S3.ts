// controllers/postController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Post from '../models/Post';

export const uploadPost = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { title, description, content } = req.body;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const fileKey = `media/${uuidv4()}-${file.originalname}`;

    // Upload media to S3
    await s3
      .putObject({
        Bucket: process.env.S3_BUCKET!,
        Key: fileKey,
        Body: fs.readFileSync(file.path),
        ContentType: file.mimetype,
      })
      .promise();

    const mediaUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileKey}`;

    // Start transcription job
    const transcribeJobName = `job-${uuidv4()}`;
    await transcribe
      .startTranscriptionJob({
        TranscriptionJobName: transcribeJobName,
        LanguageCode: 'en-US',
        Media: { MediaFileUri: mediaUrl },
        OutputBucketName: process.env.S3_BUCKET!,
        OutputKey: `subtitles/${transcribeJobName}.json`,
      })
      .promise();

    // Wait until transcription finishes (or you can use polling / webhooks)
    let jobStatus = 'IN_PROGRESS';
    while (jobStatus === 'IN_PROGRESS') {
      const data = await transcribe
        .getTranscriptionJob({ TranscriptionJobName: transcribeJobName })
        .promise();
      jobStatus = data.TranscriptionJob?.TranscriptionJobStatus!;
      await new Promise((res) => setTimeout(res, 3000));
    }

    const subtitleJsonUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/subtitles/${transcribeJobName}.json`;
    const subtitleJsonRes = await fetch(subtitleJsonUrl);
    const transcriptJson = await subtitleJsonRes.json();
    const vttContent = jsonToVtt(transcriptJson);

    const subtitleKey = `subtitles/${transcribeJobName}.vtt`;

    // Upload VTT to S3
    await s3
      .putObject({
        Bucket: process.env.S3_BUCKET!,
        Key: subtitleKey,
        Body: vttContent,
        ContentType: 'text/vtt',
      })
      .promise();

    const subtitleUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${subtitleKey}`;

    // Save post to MongoDB
    const post = await Post.create({
      title,
      description,
      mediaUrl,
      subtitleUrl,
      content,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
};




// import { Request, Response } from 'express';

// export const getPostWithSignedUrls = async (req: Request, res: Response) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ error: 'Post not found' });

//     const mediaKey = post.mediaUrl.split('.com/')[1];
//     const subtitleKey = post.subtitleUrl.split('.com/')[1];

//     const signedMediaUrl = s3.getSignedUrl('getObject', {
//       Bucket: process.env.S3_BUCKET!,
//       Key: mediaKey,
//       Expires: 300,
//     });

//     const signedSubtitleUrl = s3.getSignedUrl('getObject', {
//       Bucket: process.env.S3_BUCKET!,
//       Key: subtitleKey,
//       Expires: 300,
//     });

//     res.json({
//       title: post.title,
//       description: post.description,
//       content: post.content,
//       mediaUrl: signedMediaUrl,
//       subtitleUrl: signedSubtitleUrl,
//     });
//   } catch (err) {
//     console.error('Fetch error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };


