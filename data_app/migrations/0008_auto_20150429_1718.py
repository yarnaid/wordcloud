# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0007_uploadfile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='parent',
            field=mptt.fields.TreeForeignKey(related_name='children_questions', blank=True, to='data_app.Job', null=True),
        ),
    ]
