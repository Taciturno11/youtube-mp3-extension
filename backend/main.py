from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from downloader import descargar_mp3
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoURL(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"message": "Servidor funcionando correctamente ✅"}

@app.post("/descargar")
def descargar_audio(video: VideoURL):
    try:
        mp3_filepath = descargar_mp3(video.url)
        filename = os.path.basename(mp3_filepath)
        return FileResponse(mp3_filepath, media_type='audio/mpeg', filename=filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
