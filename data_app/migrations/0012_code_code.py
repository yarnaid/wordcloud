# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0011_auto_20150429_1743'),
    ]

    operations = [
        migrations.AddField(
            model_name='code',
            name='code',
            field=models.IntegerField(null=True, blank=True),
        ),
    ]
