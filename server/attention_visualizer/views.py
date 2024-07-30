from attention_visualizer.service import VectorGetter
from django_ratelimit.decorators import ratelimit
from django.views.decorators.http import require_http_methods
import json
from django.http import JsonResponse

vector_getter = VectorGetter()

# Create your views here.

@ratelimit(key='ip', rate='1/s')
@require_http_methods(["POST"])
def get_vectors(request):
    text = json.loads(request.body)['text']

    res = {"vectorMapping": vector_getter.get_vector_mapping(text)}

    return JsonResponse(res)
