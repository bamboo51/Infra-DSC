from rest_framework import serializers
from django.conf import settings
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

class NestedDetectionSerializer(serializers.ModelSerializer):
    """A serializer for read-only nested representation of detections"""
    class Meta:
        model = Detection
        fields = ["class_name", "confidence", "box_x1", "box_y1", "box_x2", "box_y2"]

class NestedSegmentationSerializer(serializers.ModelSerializer):
    """A serializer for read-only nested representation of segmentations"""
    class Meta:
        model = Segmentation
        fields = ["class_name", "confidence", "mask_uri"]

class AllResultsPhotoSerializer(serializers.ModelSerializer):
    """A serializer for the photo model including all results"""
    image = serializers.SerializerMethodField()
    coords = serializers.SerializerMethodField()
    detections = NestedDetectionSerializer(many=True, read_only=True)
    segmentations = NestedSegmentationSerializer(many=True, read_only=True)

    class Meta:
        model = Photo
        fields = ['id', 'image', 'uploaded_at', 'coords', 'detections', 'segmentations']

    def get_image(self, obj):
        return f"{settings.SITE_URL}{obj.image.url}"
    
    def get_coords(self, obj):
        """
        Create a nested object for coordinates if they exist.
        """
        if obj.latitude is not None and obj.longitude is not None:
            return {
                "latitude": obj.latitude,
                "longitude": obj.longitude
            }
        return None