import yt_dlp
import os

DOWNLOADS_FOLDER = "downloads"
os.makedirs(DOWNLOADS_FOLDER, exist_ok=True)

def descargar_mp3(url_video):
    opciones = {
        'format': 'bestaudio/best',
        'outtmpl': f'{DOWNLOADS_FOLDER}/%(title)s.%(ext)s',
        'ffmpeg_location': 'C:/ffmpeg/bin/ffmpeg.exe',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'noplaylist': True
    }

    with yt_dlp.YoutubeDL(opciones) as ydl:
        info = ydl.extract_info(url_video, download=True)
        filename = ydl.prepare_filename(info)
        mp3_filename = filename.rsplit('.', 1)[0] + '.mp3'
        return mp3_filename
