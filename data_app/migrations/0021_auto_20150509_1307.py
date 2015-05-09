# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.utils.timezone import now


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0020_auto_20150430_0845'),
    ]

    operations = [
        migrations.AddField(
            model_name='code',
            name='created_at',
            field=models.DateTimeField(default=now(), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='code',
            name='updated_at',
            field=models.DateTimeField(default=now(), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='codebook',
            name='created_at',
            field=models.DateTimeField(default=now(), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='codebook',
            name='updated_at',
            field=models.DateTimeField(default=now(), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='job',
            name='created_at',
            field=models.DateTimeField(default=now(), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='job',
            name='updated_at',
            field=models.DateTimeField(default=now(), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='created_at',
            field=models.DateTimeField(default=now(), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='updated_at',
            field=models.DateTimeField(default=now(), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='uploadfile',
            name='created_at',
            field=models.DateTimeField(default=now(), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='uploadfile',
            name='updated_at',
            field=models.DateTimeField(default=now(), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='variable',
            name='created_at',
            field=models.DateTimeField(default=now(), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='variable',
            name='updated_at',
            field=models.DateTimeField(default=now(), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verbatim',
            name='created_at',
            field=models.DateTimeField(default=now(), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verbatim',
            name='updated_at',
            field=models.DateTimeField(default=now(), auto_now=True),
            preserve_default=False,
        ),
    ]
