from django.contrib import admin
from data_app.models import Job, Question, Code, Variable, Verbatim, UploadFile, CodeBook
from modeltranslation.admin import TranslationAdmin
# Register your models here.


class JobAdmin(TranslationAdmin):
    pass


class CodeBookAdmin(admin.ModelAdmin):
    pass


class QuestionAdmin(TranslationAdmin):
    pass


class CodeAdmin(TranslationAdmin):
    pass


class VariableAdmin(admin.ModelAdmin):
    pass


class VerbatimAdmin(TranslationAdmin):
    pass


class UploadFileAdmin(admin.ModelAdmin):
    pass


admin.site.register(Job, JobAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Code, CodeAdmin)
admin.site.register(Verbatim, VerbatimAdmin)
admin.site.register(Variable, VariableAdmin)
admin.site.register(UploadFile, UploadFileAdmin)
admin.site.register(CodeBook, CodeBookAdmin)