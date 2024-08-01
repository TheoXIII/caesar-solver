from attention_visualizer.service import XLNetVectorGetter
from attention_visualizer.service import BertVectorGetter
from attention_visualizer.service import GPT2VectorGetter
from django_ratelimit.decorators import ratelimit
from django.views.decorators.http import require_http_methods
import json
from django.http import JsonResponse


vector_getter_mapping = {
    "BERT": BertVectorGetter(),
    "XLNet": XLNetVectorGetter(),
    "GPT2": GPT2VectorGetter(),
}


@ratelimit(key='ip', rate='1/s')
@require_http_methods(["POST"])
def get_vectors(request):
    req = json.loads(request.body)
    text = req["text"]
    model = req["model"]

    res = {"vectorMapping": vector_getter_mapping[model].get_vector_mapping(text)}

    return JsonResponse(res)
