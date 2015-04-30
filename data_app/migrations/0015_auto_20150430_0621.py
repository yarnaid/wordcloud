# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('data_app', '0014_question_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='CodeBook',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('lft', models.PositiveIntegerField(editable=False, db_index=True)),
                ('rght', models.PositiveIntegerField(editable=False, db_index=True)),
                ('tree_id', models.PositiveIntegerField(editable=False, db_index=True)),
                ('level', models.PositiveIntegerField(editable=False, db_index=True)),
                ('job', models.ForeignKey(to='data_app.Job')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='question',
            name='code_book',
            field=models.ForeignKey(blank=True, to='data_app.CodeBook', null=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='text',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='text_en',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='text_fr',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='text_sp',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='code',
            name='code_book',
            field=mptt.fields.TreeForeignKey(related_name='children_codes', blank=True, to='data_app.CodeBook', null=True),
        ),
    ]
