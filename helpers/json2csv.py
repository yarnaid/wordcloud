# -*- coding: utf-8 -*-
from __future__ import unicode_literals

__author__ = 'yarnaid'
import json
import csv


def json2csv(response, data):
    writer = csv.writer(response)
    writer.writerow(data[0].keys())  # header
    for row in data:
        writer.writerow(row.values())
    return response