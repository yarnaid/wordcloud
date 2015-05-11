# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0021_auto_20150509_1307'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='codebook',
            options={'ordering': ('updated_at',)},
        ),
        migrations.AlterModelOptions(
            name='uploadfile',
            options={'ordering': ('updated_at',)},
        ),
        migrations.AlterModelOptions(
            name='variable',
            options={'ordering': ('updated_at',)},
        ),
    ]
