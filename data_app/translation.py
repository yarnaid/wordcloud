__author__ = 'yarnaid'


from modeltranslation.translator import translator, TranslationOptions
from data_app.models import Job, Question, Code, Verbatim


class JobTranslationOptions(TranslationOptions):
    fields = ('name',)
    required_languages = ('en', )


class QuestionTranslationOptions(TranslationOptions):
    fields = ('text', 'title')
    required_languages = ('en', )


class CodeTranslationOptions(TranslationOptions):
    fields = ('text', 'title')
    required_languages = ('en', )


class VerbatimTranslationOptions(TranslationOptions):
    fields = ('verbatim',)
    required_languages = ('en', )


translator.register(Job, JobTranslationOptions)
translator.register(Question, QuestionTranslationOptions)
translator.register(Code, CodeTranslationOptions)
translator.register(Verbatim, VerbatimTranslationOptions)