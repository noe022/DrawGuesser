from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body

app = FastAPI()

strokes = []

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://127.0.0.1:5500"],
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get('/get_strokes', tags=['strokes'])
def get_strokes():
  return strokes

@app.post('/post_strokes', tags=['strokes'])
def send_strokes(new_strokes: list = Body()):
  strokes.append({
    'all_strokes': new_strokes,
  })