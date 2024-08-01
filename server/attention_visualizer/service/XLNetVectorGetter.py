from transformers import XLNetTokenizer, XLNetModel

class XLNetVectorGetter:
    def __init__(self):
        self.tokenizer = XLNetTokenizer.from_pretrained('xlnet-base-cased')
        self.model = XLNetModel.from_pretrained('xlnet-base-cased')

    def get_vector_mapping(self, text):
        inputs = self.tokenizer(text, return_tensors="pt")
        outputs = self.model(**inputs)
        tokens = self.tokenizer(text)
        last_hidden_states = outputs.last_hidden_state
        return [{"token": self.tokenizer.decode(token), "vector": [tensor.item() for tensor in vector]} for token, vector in iter(zip(tokens['input_ids'], last_hidden_states[0]))]
