# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0018_auto_20150430_0636'),
    ]

    operations = [
        migrations.AddField(
            model_name='code',
            name='overcode',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
