# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0016_auto_20150430_0622'),
    ]

    operations = [
        migrations.AddField(
            model_name='code',
            name='job',
            field=models.ForeignKey(default=0, to='data_app.Job'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='variable',
            name='job',
            field=models.ForeignKey(default=0, to='data_app.Job'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verbatim',
            name='job',
            field=models.ForeignKey(default=0, to='data_app.Job'),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='code',
            name='code_book',
        ),
        migrations.AddField(
            model_name='code',
            name='code_book',
            field=models.ManyToManyField(related_name='children_codes', null=True, to='data_app.CodeBook', blank=True),
        ),
    ]
