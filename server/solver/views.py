import sys
sys.path.insert(0, './solver')

from service.Solver import Solver

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views import View
from django.views.decorators.http import require_http_methods
import json
from django.views.decorators.csrf import get_token
from django_ratelimit.decorators import ratelimit

solver = Solver()

# Create your views here.

@require_http_methods(["GET"])
def csrf(request):
    return JsonResponse({"token": get_token(request)})

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