from django.contrib import admin
from data_app.models import Job, Question, Code, Variable, Verbatim
# Register your models here.


class JobAdmin(admin.ModelAdmin):
    pass


class QuestionAdmin(admin.ModelAdmin):
    pass


class CodeAdmin(admin.ModelAdmin):
    pass


class VariableAdmin(admin.ModelAdmin):
    pass


class VerbatimAdmin(admin.ModelAdmin):
    pass


admin.site.register(Job, JobAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Code, CodeAdmin)
admin.site.register(Verbatim, VerbatimAdmin)
admin.site.register(Variable, VariableAdmin)