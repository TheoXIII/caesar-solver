from django.shortcuts import render
from django.views.decorators.csrf import get_token
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse

# Create your views here.

@require_http_methods(["GET"])
def csrf(request):
    return JsonResponse({"token": get_token(request)})