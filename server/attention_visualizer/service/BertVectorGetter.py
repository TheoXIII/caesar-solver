from transformers import BertModel, BertTokenizer
import torch

class BertVectorGetter:
    def __init__(self):
        self.model = BertModel.from_pretrained("bert-base-uncased", torch_dtype=torch.float16, attn_implementation="sdpa")
        self.tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

    def get_vector_mapping(self, text):
        inputs = self.tokenizer(text, return_tensors="pt")
        outputs = self.model(**inputs)
        tokens = self.tokenizer(text)
        last_hidden_states = outputs.last_hidden_state
        return [{"token": self.tokenizer.decode(token).replace(" ", ""), "vector": [tensor.item() for tensor in vector]} for token, vector in iter(zip(tokens['input_ids'], last_hidden_states[0]))]
