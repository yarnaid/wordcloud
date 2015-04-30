# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0015_auto_20150430_0621'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='codebook',
            name='level',
        ),
        migrations.RemoveField(
            model_name='codebook',
            name='lft',
        ),
        migrations.RemoveField(
            model_name='codebook',
            name='rght',
        ),
        migrations.RemoveField(
            model_name='codebook',
            name='tree_id',
        ),
    ]
