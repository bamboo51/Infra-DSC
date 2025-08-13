from django.urls import path
from .views import YOLOPredictionView, AllResultsView

urlpatterns = [
    path("predict/", YOLOPredictionView.as_view(), name="yolo_prediction"),
    path("results/", AllResultsView.as_view(), name="all_results"),
]

