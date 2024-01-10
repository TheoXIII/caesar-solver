from sentiment_analysis.service.Analysis import Analysis
from django_ratelimit.decorators import ratelimit
from django.views.decorators.http import require_http_methods
import json
from django.http import JsonResponse

analysis = Analysis()

# Create your views here.

@ratelimit(key='ip', rate='100/s')
@require_http_methods(["POST"])
def analyse(request):
    text = json.loads(request.body)['text']

    res = analysis.analyse(text)

    return JsonResponse(res)
