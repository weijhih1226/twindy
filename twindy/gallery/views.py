from django.shortcuts import render
from django.http import HttpResponse
from gallery.models import *
from datetime import datetime as dt
from datetime import timedelta as td

import requests
import json

tafis_api = 'https://tafis2.cwb.gov.tw/tafis/api/'
token = 'iaU5doZ8-xHOK7sonSHAff-Zc8E'
response_ca = requests.get(url=tafis_api+'cyclone/active/', headers={"Authorization": f"Token {token}"})

opendata_api = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/'
product = 'O-A0001-001'
token = 'CWB-D8D93D37-13E2-4637-A854-3EEFCEC990CF'
response_weather = requests.get(url=opendata_api + product, params={"Authorization": f"{token}" , "limit": "1"})

def convert_timenow_to_timedata(freq: int , delay: int = 0 , local: bool = True):
    datetime = dt.now() - td(minutes = delay) if delay else dt.now()
    datetime = datetime if local else datetime - td(hours = 8)
    datetimeStr = dt.strftime(datetime , '%Y%m%d_%H%M')
    if freq == 5:
        datetime = dt.strptime(f'{datetimeStr[:12]}{str(int(datetimeStr[12]) // 5 * 5)}' , '%Y%m%d_%H%M')
    elif freq == 10:
        datetime = dt.strptime(f'{datetimeStr[:12]}0' , '%Y%m%d_%H%M')
    elif freq == 30:
        datetime = dt.strptime(f'{datetimeStr[:11]}{str(int(datetimeStr[11]) // 3 * 3)}0' , '%Y%m%d_%H%M')
    elif freq == 60:
        datetime = dt.strptime(f'{datetimeStr[:11]}' , '%Y%m%d_%H')
    elif freq == 360:
        datetime = dt.strptime(f'{datetimeStr[:9]}{str(int(datetimeStr[9:11]) // 6 * 6)}' , '%Y%m%d_%H')
    elif freq == 720:
        datetime = dt.strptime(f'{datetimeStr[:9]}{str(int(datetimeStr[9:11]) // 12 * 12)}' , '%Y%m%d_%H')
    return datetime

def convert_timedata_to_path(datetime , filedir , filename):
    return dt.strftime(datetime , f'{filedir}{filename}')

def convert_data_to_paths(objects):
    for o in objects:
        datetime = convert_timenow_to_timedata(o.image_info.data_freq , delay = o.image_info.data_delay , local = o.image_info.data_lst)
        o.image_info.data_file = convert_timedata_to_path(datetime , o.image_info.data_dir , o.image_info.data_file)
    return objects

# Create your views here.
def index(request):
    # image_meta_data = ImageMetaData.objects.all().order_by('id')
    image_block = ImageBlock.objects.all().order_by('block_display_order')
    image_block = convert_data_to_paths(image_block)
    return render(request , 'index.html' , locals())

def test(request):
    return HttpResponse(response_weather.text)

def set_cookie(request , key = None , value = None):
    response = HttpResponse('Cookie has been saved!')
    response.set_cookie(key , value , max_age = 3600)
    return response

def get_cookie(request , key = None):
    if key in request.COOKIES:
        return HttpResponse(f'{key}: {request.COOKIES[key]}')
    else:
        return HttpResponse('Cookie does not exist!')
    
def get_allcookies(request):
    if request.COOKIES:
        strcookies = ''
        for key , value in request.COOKIES.items():
            strcookies += key + ': ' + value + '<br>'
        return HttpResponse(strcookies)
    else:
        return HttpResponse('Cookie does not exist!')

def delete_cookie(request , key = None):
    response = HttpResponse('Delete cookie!')
    response.delete_cookie(key)
    return response

def set_session(request , key = None , value = None):
    response = HttpResponse('Session has been saved!')
    request.session[key] = value
    return response

def get_session(request , key = None):
    if key in request.session:
        return HttpResponse(f'{key}: {request.session[key]}')
    else:
        return HttpResponse('Session does not exist!')
    
def get_allsessions(request):
    return 'request.session'
    if request.session:
        strsessions = ''
        for key , value in request.session.items():
            strsessions += key + ': ' + value + '<br>'
        return HttpResponse(strsessions)
    else:
        return HttpResponse('Session does not exist!')
    
def delete_session(request , key = None):
    response = HttpResponse('Delete session!')
    if key in request.session:
        del request.session[key]
    return response

def check_visit(request):
    if not 'visit' in request.session:
        request.session['visit'] = True
        return HttpResponse('First visit, welcome!')
    else:
        return HttpResponse('Welcome back!')
