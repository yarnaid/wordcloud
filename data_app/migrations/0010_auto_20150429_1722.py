# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0009_auto_20150429_1720'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='parent',
            field=mptt.fields.TreeForeignKey(related_name='children_jobs', blank=True, to='data_app.Job', null=True),
        ),
        migrations.AlterField(
            model_name='verbatim',
            name='question',
            field=models.ForeignKey(blank=True, to='data_app.Question', null=True),
        ),
        migrations.AlterField(
            model_name='verbatim',
            name='variable',
            field=models.ForeignKey(blank=True, to='data_app.Variable', null=True),
        ),
    ]
