from django.shortcuts import render

# Create your views here.
import json 
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse({"detail": "Please provide username and password"})
    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({"detail": "invalid credentials."}, status=400)
    login(request, user)
    return JsonResponse({"Detail": "Successfully Logged In"})

def logout_view(request):
    #we want to ensure only authenitcated users can log out.
    if not request.user.is_authenticated:
        return JsonResponse({"Detail": "You are not logged in"})
    logout(request)
    return JsonResponse({"Detail": "Successfully Logged Out"})

@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"is Authenticated": False})
    return JsonResponse({"Is Authenticated": True})

def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"is Authenticated": False})
    return JsonResponse({"UserName": request.user.username})