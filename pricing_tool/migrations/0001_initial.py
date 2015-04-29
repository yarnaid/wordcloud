# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cell',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('language', models.CharField(max_length=100, choices=[('en', 'English'), ('fr', 'French'), ('sp', 'Spanish')])),
                ('sample_size', models.IntegerField(default=1)),
                ('story_questions', models.IntegerField(default=1)),
                ('impressions_number', models.IntegerField(default=1)),
                ('brands_number', models.IntegerField(default=1)),
                ('questionnaire_translation', models.IntegerField(default=1)),
                ('code_frame_translation', models.IntegerField(default=1)),
                ('verbatim_story_translation', models.IntegerField(default=1)),
                ('verbatim_impression_translation', models.IntegerField(default=1)),
                ('verbatim_brand_translation', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='ClientOrder',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('client_name', models.CharField(max_length=300)),
                ('study_type', models.CharField(max_length=100, choices=[('l', 'LEX'), ('l9', 'LINK 9'), ('l7', 'LINK 7'), ('l12', 'LINK 12'), ('ac', 'Adcheck'), ('ah', 'Ad`hock')])),
                ('new_coded_frame', models.BooleanField(default=True)),
                ('fields_number', models.IntegerField(default=1)),
            ],
        ),
    ]
