from django.urls import path
from .views import YOLOPredictionView

urlpatterns = [
    path("predict/", YOLOPredictionView.as_view(), name="yolo_prediction"),
]
