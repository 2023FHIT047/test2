from django.urls import path
from .views import FarmWeatherForecastView, VillageWeatherView

urlpatterns = [
    path('farm-forecast/', FarmWeatherForecastView.as_view(), name='farm-forecast'),
    path('village-weather/', VillageWeatherView.as_view(), name='village-weather'),
]
