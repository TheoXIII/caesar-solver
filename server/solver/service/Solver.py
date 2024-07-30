from solver.service import ClassifierLSTM

import torch
from torch import nn
import numpy as np
from torch.utils.data import TensorDataset, DataLoader


class Solver:
    def __init__(self):
        input_size = 27 #26, plus 1 for padding symbol
        output_size = 1
        hidden_dim = 256
        n_layers = 1

        self.train_on_gpu = torch.cuda.is_available()

        self.net = ClassifierLSTM(input_size, output_size, hidden_dim, n_layers)

        


        if (self.train_on_gpu):
            self.net.load_state_dict(torch.load("./solver/static/lstm-classifier"))
            self.net.cuda()
        else:
            self.net.load_state_dict(torch.load("./solver/static/lstm-classifier", map_location=torch.device('cpu')))
    
    def tokenize(self, test_str):
    # get rid of punctuation
        test_text = "".join([c for c in test_str.lower() if c.isalpha() and ord(c) < 128])

        test_ints = [(ord(c)-97)+1 for c in test_text]

        return test_ints
    
    def detokenize(self, ints):
        return "".join([chr(c+96) for c in ints])
    
    def do_caesar(self, text, key):
        return [(((i+key-1) % 26) + 1) for i in text]

    def call_net(self, test_ints, sequence_length=300):
        batch_size = test_ints.shape[0]
        # pad tokenized sequence
        int_features = np.zeros((batch_size, sequence_length), dtype=int)
        # For reviews shorter than seq_length words, left pad with 0s. For reviews longer than seq_length, use only the first seq_length words as the feature vector.
        for i in range(batch_size):
            int_features[i, -len(test_ints[i]):] = test_ints[i]

        features = np.zeros((batch_size, sequence_length, 27), dtype=np.float32)
        
        # Replacing the 0 at the relevant character index with a 1 to represent that character

        for i in range(batch_size):
            for u in range(sequence_length):
                features[i, u, int_features[i, u]] = 1.
        
        # convert to tensor to pass into your model
        feature_tensor = torch.from_numpy(features)
        
        batch_size = feature_tensor.size(0)
        
        # initialize hidden state
        h = self.net.init_hidden(batch_size, self.train_on_gpu)
        
        if(self.train_on_gpu):
            feature_tensor = feature_tensor.cuda()
        
        # get the output from the model
        output, h = self.net(feature_tensor, h)
        return output.detach().cpu().numpy()

    def solve_batch(self, ciphertext):
        plaintexts = np.array([self.do_caesar(ciphertext, -key) for key in range(26)])
        values = self.call_net(plaintexts)
        return np.argmax(values)

    def solve(self, ciphertext):
        #ciphertext = self.tokenize(ciphertext_str)
        key = self.solve_batch(ciphertext)
        plaintext = self.detokenize(self.do_caesar(ciphertext, -key))
        return plaintext, key
