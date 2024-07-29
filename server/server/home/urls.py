from django.urls import path,include
from . import views

from django.conf import settings
from django.conf.urls.static import static

from django.conf import settings
from django.conf.urls.static import static
from .views import upload_image
from .views import get_satellite_date

urlpatterns = [
    path('', views.index, name='index'),
    path('accounts/', include('allauth.urls')),
    # path('signup/', views.signup, name='signup'),
    # path('login/', views.login, name='login'),
    # path('dashboard/', views.dashboard, name='dashboard'),
    # path('logout/', views.logout, name='logout'), 
    # path('google_signin/', views.google_signin, name='google_signin'),
    path('insight_scan_prediction/', views.insight_scan_prediction, name='insight_scan_prediction'),
    path('start-session/',views.start_session,name='start_session'),
    # path('google_signin/', views.google_signin, name='google_signin'),
    path('upload-image/', views.upload_image, name='upload_image'),
    path('upload-singular-data/', views.upload_singular_data, name='upload_singular_data'),
    path('insight-scan-prediction/', views.insight_scan_prediction, name='insight_scan_prediction'),
    path('upload-excel-data/', views.upload_excel_data, name='upload_excel_data'),
    path('upload-excel-data/', views.upload_excel_data, name='upload_excel_data'),
    path('image', upload_image, name='upload_image'),
    path('get-satellite-data/', get_satellite_date, name='get_satellite_date')

    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)