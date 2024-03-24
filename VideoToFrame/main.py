import os
import time

video_dir = "/app/videos"
processed_dir = "/app/videos/processed"

def process_videos():
    while True:
        for filename in os.listdir(video_dir):
            if filename.endswith(".mp4"):
                video_path = os.path.join(video_dir, filename)
                print(f"Processing {video_path}")
                # Your processing logic here
                # Move processed video to a 'processed' directory
                os.rename(video_path, os.path.join(processed_dir, filename))
        time.sleep(5)  # Check for new videos every 5 seconds

if __name__ == "__main__":
    if not os.path.exists(processed_dir):
        os.makedirs(processed_dir)
    process_videos()
