# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0010_auto_20150429_1722'),
    ]

    operations = [
        migrations.AlterField(
            model_name='variable',
            name='age_bands',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='variable',
            name='csp_quota',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='variable',
            name='main_cell_text',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='variable',
            name='reg_quota',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='variable',
            name='sex',
            field=models.IntegerField(null=True, blank=True),
        ),
    ]
