from rest_framework import serializers
from .models import Photo, Detection, Segmentation

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'image', 'uploaded_at', 'latitude', 'longitude']
        read_only_fields = ['id', 'uploaded_at']

class DetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detection
        fields = '__all__'

class SegmentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Segmentation
        fields = '__all__'