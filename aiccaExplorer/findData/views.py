from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index (request):
    return render(request,'find_data/index.html')

def homePageView(request):
    return HttpResponse("Hello, World!")