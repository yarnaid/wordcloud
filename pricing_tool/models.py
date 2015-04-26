from django.db import models
from django.conf import settings

# Create your models here.


class ClientOrder(models.Model):
    client_name = models.CharField(max_length=300)
    study_type = models.CharField(choices=settings.STUDY_TYPES, max_length=100)
    new_coded_frame = models.BooleanField(default=True)
    fields_number = models.IntegerField(default=1)


class Cell(models.Model):
    language = models.CharField(choices=settings.LANGUAGES, max_length=100)
    sample_size = models.IntegerField(default=1)
    story_questions = models.IntegerField(default=1)
    impressions_number = models.IntegerField(default=1)
    brands_number = models.IntegerField(default=1)
    questionnaire_translation = models.IntegerField(default=1)
    code_frame_translation = models.IntegerField(default=1)
    verbatim_story_translation = models.IntegerField(default=1)
    verbatim_impression_translation = models.IntegerField(default=1)
    verbatim_brand_translation = models.IntegerField(default=1)
