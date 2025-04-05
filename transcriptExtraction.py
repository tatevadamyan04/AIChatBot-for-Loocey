from youtube_transcript_api import YouTubeTranscriptApi

video_id = "O2FsmfX3_9c?si=S2q888dO4fdg2T4Z"
transcript = YouTubeTranscriptApi.get_transcript(video_id)

with open("loocey_transcript2.txt", "w", encoding="utf-8") as file:
    for line in transcript:
        file.write(f"{line['text']}\n")
