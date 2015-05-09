from django.contrib import admin
from data_app.models import Job, Question, Code, Variable, Verbatim, UploadFile, CodeBook
from modeltranslation.admin import TranslationAdmin
# Register your models here.


class TranslationAdminTimeMixin(TranslationAdmin):
    readonly_fields = ('created_at', 'updated_at')


class ModelAdminTimeMixin(admin.ModelAdmin):
    readonly_fields = ('created_at', 'updated_at')


class JobAdmin(TranslationAdminTimeMixin):
    pass


class CodeBookAdmin(ModelAdminTimeMixin):
    pass


class QuestionAdmin(TranslationAdminTimeMixin):
    pass


class CodeAdmin(TranslationAdminTimeMixin):
    pass


class VariableAdmin(ModelAdminTimeMixin):
    pass


class VerbatimAdmin(TranslationAdminTimeMixin):
    pass


class UploadFileAdmin(ModelAdminTimeMixin):
    pass


admin.site.register(Job, JobAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Code, CodeAdmin)
admin.site.register(Verbatim, VerbatimAdmin)
admin.site.register(Variable, VariableAdmin)
admin.site.register(UploadFile, UploadFileAdmin)
admin.site.register(CodeBook, CodeBookAdmin)