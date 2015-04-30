# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0012_code_code'),
    ]

    operations = [
        migrations.RenameField(
            model_name='code',
            old_name='description',
            new_name='text',
        ),
        migrations.RenameField(
            model_name='code',
            old_name='description_en',
            new_name='text_en',
        ),
        migrations.RenameField(
            model_name='code',
            old_name='description_fr',
            new_name='text_fr',
        ),
        migrations.RenameField(
            model_name='code',
            old_name='description_sp',
            new_name='text_sp',
        ),
    ]
