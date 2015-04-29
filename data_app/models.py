from django.db import models
from mptt.models import MPTTModel, TreeForeignKey

# Create your models here.


class Job(MPTTModel):
    name = models.CharField(max_length=255)
    number = models.IntegerField()
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children_codes')


class Question(MPTTModel):
    text = models.TextField()
    title = models.CharField(max_length=255, blank=True)
    kind = models.CharField(max_length=255)
    parent = TreeForeignKey(Job, null=False, blank=False, related_name='children_questions')
    code_book = models.ForeignKey('Code')  # key for root code


class Code(MPTTModel):
    ''' codes, nets and books in one model
    '''
    description = models.TextField()
    title = models.CharField(max_length=255, blank=True)
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children_codes')


class Verbatim(MPTTModel):
    question = models.ForeignKey('Question')
    variable = models.ForeignKey('Variable')
    verbatim = models.TextField()
    parent = TreeForeignKey('Code', null=True, blank=True, related_name='children_verbatims')


class Variable(models.Model):
    uid = models.IntegerField()
    sex = models.IntegerField()
    age_bands = models.IntegerField()
    reg_quota = models.IntegerField()
    csp_quota = models.IntegerField()
    main_cell_text = models.CharField(max_length=255)