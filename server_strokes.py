from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body
import torch
from rnn_module import RNNModule

categories = ['book', 'car', 'crown', 'flamingo', 'moon', 'rabbit', 'submarine', 'watermelon']

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)

norm_stats = torch.load('norm_stats.pth', map_location=torch.device('cpu'))
mean_xy = norm_stats['mean_xy']
std_xy = norm_stats['std_xy']

def preprocess_strokes(raw_strokes):
  # raw strokes format [[x1,y1], [x2,y2]]
  # expected format (x, y, pen_flag)
  # pen_flag = 1 part of stroke, 0 end of stroke
  sequence = []
  prev_x = prev_y = 0.0
  for stroke in raw_strokes:
    n = len(stroke)
    for i, point in enumerate(stroke):
      x, y = point
      dx = x - prev_x
      dy = y - prev_y
      pen = 1.0 if i == n - 1 else 0.0
      sequence.append([dx, dy, pen])
      prev_x, prev_y = x, y

  if not sequence:
    raise ValueError("No hay puntos para preprocesar")

  x = torch.tensor(sequence, dtype=torch.float32).unsqueeze(0)
  x[:, :, 0] = (x[:, :, 0] - mean_xy[0]) / (std_xy[0] + 1e-6)   # normaliza dx
  x[:, :, 1] = (x[:, :, 1] - mean_xy[1]) / (std_xy[1] + 1e-6)   # normaliza dy
  lengths = torch.tensor([len(sequence)], dtype=torch.long)
  return x, lengths

model = RNNModule(input_size=3, hidden_size=128, output_size=8)
model.load_state_dict(torch.load('model_trained.pth', map_location=torch.device('cpu')))
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

  print(probs)
  return {
    "prediction": category,
  }