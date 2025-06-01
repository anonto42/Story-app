import aws from "aws-sdk";
import config from "../../../config";


const S3 = new aws.S3({
    region: config.aws.aws_resion!,
    credentials:{
        accessKeyId: config.aws.aws_access_key!,
        secretAccessKey: config.aws.aws_secret_key!
    }
});

const transcribe = new aws.TranscribeService({
    region: config.aws.aws_resion!,
    credentials:{
        accessKeyId: config.aws.aws_access_key!,
        secretAccessKey: config.aws.aws_secret_key!
    }
})

function jsonToVtt(transcriptJson: any): string {
    let result = 'WEBVTT\n\n';
    transcriptJson.results.items.forEach((item: any, index: number) => {
    if (item.type === 'pronunciation') {
        const start = parseFloat(item.start_time);
        const end = parseFloat(item.end_time);
        const startTime = new Date(start * 1000).toISOString().substr(11, 12);
        const endTime = new Date(end * 1000).toISOString().substr(11, 12);
        result += `${index + 1}\n${startTime} --> ${endTime}\n${item.alternatives[0].content}\n\n`;
        }
    });
    return result;
}

export const AwsMedia = {
    S3,
    transcribe,
    jsonToVtt
}