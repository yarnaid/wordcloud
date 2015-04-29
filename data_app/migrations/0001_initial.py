# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Code',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.TextField()),
                ('title', models.CharField(max_length=255, blank=True)),
                ('lft', models.PositiveIntegerField(editable=False, db_index=True)),
                ('rght', models.PositiveIntegerField(editable=False, db_index=True)),
                ('tree_id', models.PositiveIntegerField(editable=False, db_index=True)),
                ('level', models.PositiveIntegerField(editable=False, db_index=True)),
                ('parent', mptt.fields.TreeForeignKey(related_name='children_codes', blank=True, to='data_app.Code', null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('number', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField()),
                ('title', models.CharField(max_length=255, blank=True)),
                ('kind', models.CharField(max_length=255)),
                ('lft', models.PositiveIntegerField(editable=False, db_index=True)),
                ('rght', models.PositiveIntegerField(editable=False, db_index=True)),
                ('tree_id', models.PositiveIntegerField(editable=False, db_index=True)),
                ('level', models.PositiveIntegerField(editable=False, db_index=True)),
                ('code_book', models.ForeignKey(to='data_app.Code')),
                ('parent', mptt.fields.TreeForeignKey(related_name='children_questions', to='data_app.Job')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Variable',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uid', models.IntegerField()),
                ('sex', models.IntegerField()),
                ('age_bands', models.IntegerField()),
                ('reg_quota', models.IntegerField()),
                ('csp_quota', models.IntegerField()),
                ('main_cell_text', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Verbatim',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('verbatim', models.TextField()),
                ('code', mptt.fields.TreeForeignKey(related_name='children_verbatims', blank=True, to='data_app.Code', null=True)),
                ('question', models.ForeignKey(to='data_app.Question')),
                ('variable', models.ForeignKey(to='data_app.Variable')),
            ],
        ),
    ]
