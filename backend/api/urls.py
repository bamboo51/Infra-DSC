from django.urls import path
from .views import PhotoDetailView, PhotoListView, YOLOPredictionView

urlpatterns = [
    path("predict/", YOLOPredictionView.as_view(), name="yolo_prediction"),
    #path("results/", AllResultsView.as_view(), name="all_results"),
    path("photos/", PhotoListView.as_view(), name="photo_list"),
    path("photos/<int:pk>/", PhotoDetailView.as_view(), name="photo_detail"),
]

