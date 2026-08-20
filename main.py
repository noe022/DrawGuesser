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

@app.get('/get', tags=['greet'])
def greet():
  return "Hi demon!"

# Send strokes to server
@app.post('/post', tags=['strokes'])
def get_strokes(strokes: list = Body()):
  print(strokes)
  strokes.append({
    'all_strokes': strokes,
  })

