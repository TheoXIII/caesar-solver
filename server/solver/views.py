from solver.service.Solver import Solver

from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views import View
from django.views.decorators.http import require_http_methods
import json
from django_ratelimit.decorators import ratelimit

solver = Solver()

# Create your views here.

@ratelimit(key='ip', rate='1/s')
@require_http_methods(["POST"])
def solve(request):
    ciphertext = solver.tokenize(json.loads(request.body)['ciphertext'])

    if (len(ciphertext) > 300 or len(ciphertext) < 10):
        return HttpResponseBadRequest()

    plaintext, key = solver.solve(ciphertext)

    res = {'plaintext': plaintext, 'key': str(key)}

    return JsonResponse(res)

"""class Solve(View):
    def post(self, request):
        ciphertext = HttpRequest.POST.ciphertext

        plaintext, key = Solver.solve(ciphertext)

        res = {plaintext: plaintext, key: key}

        return HttpResponse(res.json())"""