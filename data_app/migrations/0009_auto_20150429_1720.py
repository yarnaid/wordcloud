# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0008_auto_20150429_1718'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='code_book',
            field=models.ForeignKey(blank=True, to='data_app.Code', null=True),
        ),
    ]
