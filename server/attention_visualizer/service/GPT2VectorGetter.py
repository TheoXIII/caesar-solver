from transformers import GPT2Tokenizer, GPT2Model


class GPT2VectorGetter:
    def __init__(self):
        self.model = GPT2Model.from_pretrained("gpt2")
        self.tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

    def get_vector_mapping(self, text):
        inputs = self.tokenizer(text, return_tensors="pt")
        outputs = self.model(**inputs)
        tokens = self.tokenizer(text)
        last_hidden_states = outputs.last_hidden_state
        return [{"token": self.tokenizer.decode(token), "vector": [tensor.item() for tensor in vector]} for
                token, vector in iter(zip(tokens['input_ids'], last_hidden_states[0]))]
