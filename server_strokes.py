from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body
import torch
from rnn_module import RNNModule

categories = ['book', 'car', 'crown', 'flamingo', 'moon', 'rabbit', 'submarine', 'watermelon']

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://127.0.0.1:5500"],
  allow_methods=["*"],
  allow_headers=["*"],
)

def preprocess_strokes(raw_strokes):
  # raw strokes format [[x1,y1], [x2,y2]]
  # expected format (x, y, pen_flag)
  # pen_flag = 1 part of stroke, 0 end of stroke
  sequence = []
  for stroke in raw_strokes:
    for i, point in enumerate(stroke):
      x, y = point
      pen = 1.0 if i > 0 else 0.0
      sequence.append([x, y, pen])

  x = torch.tensor(sequence, dtype=torch.float32).unsqueeze(0)
  lengths = torch.tensor([x.shape[1]], dtype=torch.long)
  return x, lengths

model = RNNModule(input_size=3, hidden_size=128, output_size=8)
model.load_state_dict(torch.load('model_trained.pth'))
model.eval()

@app.post('/post_strokes', tags=['strokes'])
def send_strokes(new_strokes: list = Body()):
  x, lengths = preprocess_strokes(new_strokes)
  model.eval()

  with torch.no_grad():
    # logits = raw values from last layer
    logits = model(x, lengths)
    probs = torch.softmax(logits, dim=-1)
    prediction = torch.argmax(probs, dim=1).item()
    category = categories[prediction]

  return {
    "prediction": category,
  }