import torch
from torch import nn
from torch.nn.utils.rnn import pack_padded_sequence

class RNNModule(nn.Module):
  def __init__(self, input_size, hidden_size, output_size):
    super().__init__()
    self.rnn = nn.GRU(input_size, hidden_size, batch_first=True)

    self.final = nn.Sequential(
      nn.Linear(hidden_size, 8),
      # No f.act, we use crossEntropyLoss (applies Softmax)
      nn.Linear(8, output_size),
    )

  def forward(self, x, lengths):
    packed = pack_padded_sequence(x, lengths.cpu(), batch_first=True, enforce_sorted=False)
    packed_out, h_n = self.rnn(packed)
    # h_n is the last state
    last_output = h_n[-1] # form: (batch, hidden_size)
    return self.final(last_output)