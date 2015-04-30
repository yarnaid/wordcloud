# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0005_auto_20150429_1326'),
    ]

    operations = [
        migrations.AddField(
            model_name='code',
            name='description_en',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='code',
            name='description_fr',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='code',
            name='description_sp',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='code',
            name='title_en',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='code',
            name='title_fr',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='code',
            name='title_sp',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='question',
            name='text_en',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='question',
            name='text_fr',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='question',
            name='text_sp',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='question',
            name='title_en',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='question',
            name='title_fr',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='question',
            name='title_sp',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='verbatim',
            name='verbatim_en',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='verbatim',
            name='verbatim_fr',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='verbatim',
            name='verbatim_sp',
            field=models.TextField(null=True),
        ),
    ]
