import os
import sys
import shutil
import yt_dlp

# ────────── Dónde guardar los MP3 (carpeta escribible) ──────────
DOWNLOADS_FOLDER = os.path.join(
    os.getenv("APPDATA"), "YouTubeMP3Server", "downloads"
)
os.makedirs(DOWNLOADS_FOLDER, exist_ok=True)

# ────────── Localizar ffmpeg ──────────
def localizar_ffmpeg() -> str | None:
    # 1) ¿Está en el PATH?
    path_ffmpeg = shutil.which("ffmpeg")
    if path_ffmpeg:
        return path_ffmpeg

    # 2) ¿Viene empacado dentro del EXE (PyInstaller)?
    #    Los archivos añadidos con --add-binary están en sys._MEIPASS
    pkg_dir = getattr(sys, "_MEIPASS", None)
    if pkg_dir:
        exe_path = os.path.join(pkg_dir, "ffmpeg.exe")
        if os.path.exists(exe_path):
            return exe_path

    # 3) Ruta fija (último recurso)
    fallback = r"C:\ffmpeg\bin\ffmpeg.exe"
    return fallback if os.path.exists(fallback) else None


FFMPEG_PATH = localizar_ffmpeg()

# ────────── Función principal ──────────
def descargar_mp3(url_video: str) -> str:
    if not FFMPEG_PATH:
        raise RuntimeError(
            "ffmpeg no encontrado. Instálalo o empaqueta ffmpeg.exe con el EXE."
        )

    opciones = {
        "format": "bestaudio/best",
        "outtmpl": f"{DOWNLOADS_FOLDER}/%(title)s.%(ext)s",
        "ffmpeg_location": FFMPEG_PATH,
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }
        ],
        "noplaylist": True,
        "quiet": True,
    }

    with yt_dlp.YoutubeDL(opciones) as ydl:
        info = ydl.extract_info(url_video, download=True)
        original = ydl.prepare_filename(info)               # .webm / .m4a …
        mp3_file = os.path.splitext(original)[0] + ".mp3"   # mismo nombre .mp3
        return mp3_file
