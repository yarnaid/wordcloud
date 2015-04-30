# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0017_auto_20150430_0626'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='code',
            name='code_book',
        ),
        migrations.AddField(
            model_name='code',
            name='code_book',
            field=models.ForeignKey(related_name='children_codes', blank=True, to='data_app.CodeBook', null=True),
        ),
    ]
