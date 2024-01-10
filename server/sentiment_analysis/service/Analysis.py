import spacy
from spacytextblob.spacytextblob import SpacyTextBlob
import nltk
nltk.download('punkt')

class Analysis:
    def __init__(self):
        self.nlp = spacy.load('en_core_web_sm')
        self.nlp.add_pipe('spacytextblob')
    
    def analyse(self, text):
        doc = self.nlp(text)
        polarity = doc._.blob.polarity
        assessments = [assessment[:2] for assessment in doc._.blob.sentiment_assessments.assessments]
        return {'polarity': polarity, 'assessments': assessments}