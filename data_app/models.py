import re
from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
import pandas as pd
import os
import re

# Create your models here.

cb_regex = '^cb_.*$'


class Job(MPTTModel):
    name = models.CharField(max_length=255)
    number = models.IntegerField()
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children_jobs')

    def __str__(self):
        return '{}_{}'.format(self.number, self.name)


class Question(MPTTModel):
    name = models.CharField(max_length=255, blank=True)
    text = models.TextField(blank=True)
    title = models.CharField(max_length=255, blank=True)
    kind = models.CharField(max_length=255)
    parent = TreeForeignKey(Job, null=True, blank=True, related_name='children_questions')
    code_book = models.ForeignKey('CodeBook', null=True, blank=True)  # key for root code

    def __str__(self):
        return '{}({})'.format(self.title, self.kind)


class CodeBook(models.Model):
    name = models.CharField(max_length=255)
    job = models.ForeignKey('Job')

    def __str__(self):
        return '{}'.format(self.name)


class Code(MPTTModel):
    ''' codes, nets and books in one model
    '''
    text = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True)
    code = models.IntegerField(blank=True, null=True)
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children_codes')
    code_book = models.ForeignKey('CodeBook', null=True, blank=True, related_name='children_codes')
    job = models.ForeignKey('Job')
    overcode = models.BooleanField()

    def __str__(self):
        return '{}'.format(self.title)


class Verbatim(MPTTModel):
    question = models.ForeignKey('Question', blank=True, null=True)
    variable = models.ForeignKey('Variable', blank=True, null=True)
    verbatim = models.TextField()
    parent = TreeForeignKey('Code', null=True, blank=True, related_name='children_verbatims')
    job = models.ForeignKey('Job')

    def __str__(self):
        return '{}'.format(self.verbatim)


class Variable(models.Model):
    uid = models.IntegerField()
    sex = models.IntegerField(blank=True, null=True)
    age_bands = models.IntegerField(blank=True, null=True)
    reg_quota = models.IntegerField(blank=True, null=True)
    csp_quota = models.IntegerField(blank=True, null=True)
    main_cell_text = models.CharField(max_length=255, blank=True, null=True)
    job = models.ForeignKey('Job')

    def __str__(self):
        return '[{}][{}][{}][{}][{}][{}]'.format(self.uid,
                                                 self.sex,
                                                 self.age_bands,
                                                 self.reg_quota,
                                                 self.csp_quota,
                                                 self.main_cell_text)


class UploadFile(models.Model):
    sheet = models.FileField()

    def __str__(self):
        return '{}'.format(os.path.basename(self.sheet.name))

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super(UploadFile, self).save(force_insert=force_insert, force_update=force_update,
                                     using=using, update_fields=update_fields)
        errors = False

        file_name = self.sheet.path
        f = pd.ExcelFile(file_name)

        file_name = os.path.splitext(file_name)[0]
        file_name = os.path.basename(file_name)
        job_number = file_name.split('_')[0]
        job_name = ' '.join(file_name.split('_')[1:])
        job = Job.objects.get_or_create(name=job_name, number=job_number)
        job[0].save()

        code_books_names = filter(lambda x: re.match(cb_regex, x, re.IGNORECASE) is not None, f.sheet_names)
        code_books = {name: f.parse(name) for name in code_books_names}

        question_df = f.parse('question')
        question_df = question_df.where(pd.notnull(question_df), None)
        for question in question_df.iterrows():
            qq = question[1]
            cb = CodeBook.objects.get_or_create(job=job[0], name=qq.code_book)
            if cb[1]:
                cb[0].save()
            q = Question.objects.get_or_create(
                # text=qq.title,
                # title=qq.text,
                name=qq.id,
                kind=qq.type,
                parent=job[0],
                code_book=cb[0],
            )[0]
            q.text_en = qq.text
            q.title_en = qq.title
            for key in qq.keys():
                if key.count('text_') or key.count('title_'):
                    setattr(q. key, qq[key])
            q.save()

        variable_df = f.parse('variables')
        variable_df = variable_df.where(pd.notnull(variable_df), None)
        variable_records = list()
        for vverbatim in variable_df.iterrows():
            verbat = vverbatim[1]
            v = Variable.objects.get_or_create(
                uid=verbat[0],
                sex=verbat[1],
                age_bands=verbat[2],
                reg_quota=verbat[3],
                csp_quota=verbat[4],
                main_cell_text=verbat[5],
                job=job[0]
            )
            variable_records.append(v)

        for key, cb in code_books.iteritems():
            try:
                code_book = CodeBook.objects.get(
                    name=key,
                    job=job[0]
                )
            except Exception as e:
                print key, job[0]
                raise e
            cb = cb.where(pd.notnull(cb), None)
            # for row in cb.iterrows():
            #     r = row[1]
            #     last_net = None
            #     if r.NET is not None:
            #         last_net = r.NET
            #     else:
            #         r.NET = last_net
            #     print r.NET
            ocb = cb[pd.isnull(cb.Codes)]
            cb = cb[pd.notnull(cb.Codes)]
            for oocode in ocb.iterrows():
                code = oocode[1]
                oc = Code.objects.get_or_create(
                    text=code.text,
                    title=code.title,
                    code=code.NET,
                    parent=None,
                    code_book=code_book,
                    job=job[0],
                    overcode=True
                )[0]
                oc.text_en = code.text
                oc.title_en = code.title
                for ckey in code.keys():
                    if ckey.count('text_') > 0 or ckey.count('title_') > 0:
                        setattr(oc, ckey, code[ckey])
                oc.save()
            for ccode in cb.iterrows():
                code = ccode[1]
                parent = Code.objects.get_or_create(code=code.NET, job=job[0], overcode=True, code_book=code_book, parent=None)
                if parent[1]:
                    parent[0].save()
                parent = parent[0]
                c = Code.objects.get_or_create(
                    text=code.text,
                    title=code.title,
                    code=code.Codes,
                    job=job[0],
                    overcode=False,
                    parent=parent,
                    code_book=code_book
                )[0]
                c.text_en = code.text
                c.title_en = code.title
                for ckey in code.keys():
                    if ckey.count('text_') > 0 or ckey.count('title_') > 0:
                        setattr(c, ckey, code[ckey])
                c.save()

        verbatim_df = f.parse('verbatims')
        verbatim_df = verbatim_df.where(pd.notnull(verbatim_df), None)

        keys = verbatim_df.keys()
        var_id = keys[0]
        q = set()
        for k in keys[1:]:
            q.add(k.split('-')[0].rstrip())
        for q_n in q:
            var_keys = [var_id]
            for vk in keys:
                if vk.count(q_n) > 0:
                    var_keys.append(vk)
            vdf = verbatim_df[var_keys]
            question = Question.objects.get(parent=job[0], name=q_n)
            for vverbatim in vdf.iterrows():
                verbat = vverbatim[1]
                if verbat[0] is not None:
                    var = Variable.objects.get(uid=verbat[0], job=job[0])
                else:
                    var = Variable.objects.get_or_create(uid=-1, job=job[0])
                    if var[1]:
                        var[0].save()
                    var = var[0]
                text = verbat[1]
                if text is None:
                    continue  # TODO: dropna for df
                for code_id in verbat[2:]:
                    if code_id is None:
                        continue
                    code = Code.objects.get_or_create(job=job[0], code=code_id, overcode=False, code_book=question.code_book)
                    if code[1]:
                        continue
                        # code[0].save()

                    code = code[0]
                    v = Verbatim.objects.get_or_create(
                        job=job[0],
                        variable=var,
                        verbatim=text,
                        parent=code,
                        question=question
                    )
                    v[0].verbatim_en = text
                    for ckey in verbat.keys():
                        if ckey.count('text_') > 0:
                            lang = ckey.split('_')[-1]
                            setattr(v, 'verbatim_' + lang, verbat[ckey])

                    if v[1]:
                        v[0].save()
