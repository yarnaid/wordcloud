# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0019_code_overcode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='text',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='code',
            name='text_en',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='code',
            name='text_fr',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='code',
            name='text_sp',
            field=models.TextField(null=True, blank=True),
        ),
    ]
