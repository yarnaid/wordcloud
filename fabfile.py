# -*- coding: utf-8 -*-

from fabric.api import local
import os

COMPASS_APPS_LABELS = (
    'cloud',
    'c_tree',
    'compare_vis',
    '.'
)


def hello():
    print 'Hello!'


def compass_watch(app_label):
    static_root = os.path.join(app_label, 'static', app_label)
    local('compass watch --sass-dir "{static}/css/scss" --css-dir "{static}/css" --javascripts-dir "{static}/js" &'.format(static=static_root))


def compass_stop():
    local('killall compass')


def compass_watch_all():
    for app in COMPASS_APPS_LABELS:
        compass_watch(app)