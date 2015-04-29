# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0002_auto_20150428_2141'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='parent',
            field=mptt.fields.TreeForeignKey(related_name='children_codes', blank=True, to='data_app.Job', null=True),
        ),
    ]
