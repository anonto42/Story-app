import whisper
import datetime
import ffmpeg
import os

model = whisper.load_model("base") 

def format_time(seconds):
    return str(datetime.timedelta(seconds=seconds)).split('.')[0].replace(',', '.')

def convert_mp3_to_wav(mp3_file_path):
    wav_file_path = os.path.splitext(mp3_file_path)[0] + ".wav"
    
    try:
        ffmpeg.input(mp3_file_path).output(wav_file_path, ac=1, ar=16000).run()  
        print(f"Converted {mp3_file_path} to {wav_file_path}")
        return wav_file_path
    except Exception as e:
        print(f"Error during conversion: {e}")
        return None

def create_subtitles_from_audio(mp3_file_path, output_srt_path="subtitles.srt"):
    try:
        wav_file_path = convert_mp3_to_wav(mp3_file_path)
        if not wav_file_path:
            return
        
        result = model.transcribe(wav_file_path)
        
        with open(output_srt_path, "w") as srt_file:
            for i, segment in enumerate(result['segments']):
                start_time = format_time(segment['start'])
                end_time = format_time(segment['end'])
                text = segment['text']
                
                srt_file.write(f"{i + 1}\n")
                srt_file.write(f"{start_time} --> {end_time}\n")
                srt_file.write(f"{text}\n\n")
        
        print(f"Subtitles saved to {output_srt_path}")
        
        os.remove(wav_file_path)
        print(f"Temporary WAV file deleted: {wav_file_path}")
    
    except Exception as e:
        print(f"Error creating subtitles: {e}")

audio_file_path = "english.mp3" 
create_subtitles_from_audio(audio_file_path)
