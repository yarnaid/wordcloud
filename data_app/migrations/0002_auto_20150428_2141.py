# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='level',
            field=models.PositiveIntegerField(default=0, editable=False, db_index=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='job',
            name='lft',
            field=models.PositiveIntegerField(default=0, editable=False, db_index=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='job',
            name='rght',
            field=models.PositiveIntegerField(default=0, editable=False, db_index=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='job',
            name='tree_id',
            field=models.PositiveIntegerField(default=0, editable=False, db_index=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verbatim',
            name='level',
            field=models.PositiveIntegerField(default=0, editable=False, db_index=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verbatim',
            name='lft',
            field=models.PositiveIntegerField(default=0, editable=False, db_index=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verbatim',
            name='rght',
            field=models.PositiveIntegerField(default=0, editable=False, db_index=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verbatim',
            name='tree_id',
            field=models.PositiveIntegerField(default=0, editable=False, db_index=True),
            preserve_default=False,
        ),
    ]
