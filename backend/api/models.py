from django.db import models

# Create your models here.
class Photo(models.Model):
    image = models.ImageField(upload_to='photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    image_hash = models.CharField(max_length=64, unique=True, db_index=True, null=True)

    def __str__(self):
        return f"Photo {self.id} - {self.image.name}"
    
class Detection(models.Model):
    photo = models.ForeignKey(Photo, related_name='detections', on_delete=models.CASCADE)
    class_name = models.CharField(max_length=100)
    confidence = models.FloatField()
    box_x1 = models.FloatField()
    box_y1 = models.FloatField()
    box_x2 = models.FloatField()
    box_y2 = models.FloatField()

    def __str__(self):
        return f"Detection for Photo {self.photo.id} - {self.class_name}"

class Segmentation(models.Model):
    photo = models.ForeignKey(Photo, related_name='segmentations', on_delete=models.CASCADE)
    mask_uri = models.TextField()
    class_name = models.CharField(max_length=100)
    confidence = models.FloatField()

    def __str__(self):
        return f"Segmentation for Photo {self.photo.id} - {self.class_name}"