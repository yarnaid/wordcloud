__author__ = 'yarnaid'
from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Field, ButtonHolder, Fieldset, Button, MultiField
from crispy_forms.bootstrap import InlineCheckboxes, InlineField, FormActions, PrependedText, Div
from django.utils.translation import ugettext as _
from django.forms.formsets import formset_factory

from django.conf import settings

study_types = (
    ('l', _('LEX')),
    ('l9', _('LINK 9')),
    ('l7', _('LINK 7')),
    ('l12', _('LINK 12')),
    ('ac', _('Adcheck')),
    ('ah', _('Ad`hock')),
)


class HeaderForm(forms.Form):
    client_name = forms.CharField(max_length=300)
    study_type = forms.ChoiceField(choices=study_types)
    new_coded_frame = forms.BooleanField(widget=forms.CheckboxInput, initial=True)
    fields_number = forms.IntegerField(min_value=1, initial=1)

    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.form_id = 'id-headerForm'
        self.helper.form_class = 'form-horizontal'
        # self.helper.form_class = 'form-inline'
        # self.helper.field_template = 'bootstrap3/layout/inline_field.html'
        self.helper.label_class = 'col-lg-4'
        self.helper.field_class = 'col-lg-7'

        self.helper.layout = Layout(
            Div(
                Div('client_name', css_class='col-md-5'),
                Div(Field('new_coded_frame'), css_class='col-md-4'),
                css_class='row-fluid'
            ),
            Div(
                Div(Field('study_type'), css_class='col-md-5'),
                Div(Field('fields_number'), css_class='col-md-4'),
                css_class='row-fluid'
            ),
        )

        # self.helper.add_input(Submit('submit', 'Submit'))
        super(HeaderForm, self).__init__(*args, **kwargs)


class CellForm(forms.Form):
    language = forms.ChoiceField(choices=settings.LANGUAGES)
    sample_size = forms.IntegerField(min_value=1, initial=1)
    story_questions = forms.IntegerField(min_value=1, initial=1)
    impressions_number = forms.IntegerField(min_value=1, initial=1)
    brands_number = forms.IntegerField(min_value=1, initial=1)
    questions_number = forms.IntegerField(
        widget=forms.TextInput(attrs={'readonly': 'readonly'})
    )
    # qt1 = forms.IntegerField(min_value=0, initial=0)
    questionnaire_translation = forms.IntegerField(min_value=1, initial=1)
    code_frame_translation = forms.IntegerField(min_value=1, initial=1)
    verbatim_story_translation = forms.IntegerField(min_value=1, initial=1)
    verbatim_impression_translation = forms.IntegerField(min_value=1, initial=1)
    verbatim_brand_translation = forms.IntegerField(min_value=1, initial=1)

    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.form_id = 'id-cellFrom'
        self.helper.form_class = 'form-inline'
        self.helper.field_template = 'bootstrap3/layout/inline_field.html'

        self.helper.layout = Layout(
            Div(
                Div('language', css_class='col-xs-1'),
                Div('sample_size', css_class='col-xs-1'),
                Div('story_questions', css_class='col-xs-1'),
                Div('impression_number', css_class='col-xs-1'),
                Div('brands_number', css_class='col-xs-1'),
                Div('questions_number', css_class='col-xs-1'),
                Div('questionnaire_translation', css_class='col-xs-1'),
                Div('code_frame_translation', css_class='col-xs-1'),
                Div('verbatim_story_translation', css_class='col-xs-1'),
                Div('verbatim_impression_translation', css_class='col-xs-1'),
                Div('verbatim_brand_translation', css_class='col-xs-1'),
                css_class='row-fluid'
            )
        )

        super(CellForm, self).__init__(*args, **kwargs)


CellFormSet = formset_factory(CellForm, extra=0)