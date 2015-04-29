# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0003_job_parent'),
    ]

    operations = [
        migrations.RenameField(
            model_name='verbatim',
            old_name='code',
            new_name='parent',
        ),
    ]
