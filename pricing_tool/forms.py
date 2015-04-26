__author__ = 'yarnaid'
from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms_foundation.layout import Submit, Layout, Field, ButtonHolder, Fieldset, InlineField, InlineJustifiedField, Button
from crispy_forms_foundation.forms import FoundationForm
from crispy_forms.bootstrap import InlineCheckboxes, InlineField, FormActions
from django.utils.translation import ugettext as _

from django.conf import settings

study_types = (
    ('l', _('LEX')),
    ('l9', _('LINK 9')),
    ('l7', _('LINK 7')),
    ('l12', _('LINK 12')),
    ('ac', _('Adcheck')),
    ('ah', _('Ad`hock')),
)


class HeaderForm(FoundationForm):
    client_name = forms.CharField(max_length=300)
    study_type = forms.ChoiceField(choices=study_types)
    new_coded_frame = forms.BooleanField(widget=forms.CheckboxInput, initial=True)
    fields_number = forms.IntegerField(min_value=1, initial=1)
    language = forms.ChoiceField(choices=settings.LANGUAGES)
    sample_size = forms.IntegerField(min_value=1, initial=1)
    story_questions = forms.IntegerField(min_value=1, initial=1)
    impersions_number = forms.IntegerField(min_value=1, initial=1)
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

    # title = "Pricing"
    # action = 'test'
    # layout = Layout(Fieldset("Pricing", "client_name", "study_type"))
    # layout = Layout(
    #     InlineJustifiedField('client_name')
    # )

    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        # self.helper.form_id = 'id-headerForm'
        self.helper.form_class = 'form-inline'
        self.helper.form_method = 'post'
        self.helper.field_template = 'bootstrap3/layout/inline_field.html'
        self.helper.form_action = 'submit_survey'
        self.helper.label_class = 'col-lg-2'
        self.helper.field_class = 'col-lg-8'

        self.helper.layout = Layout(
            InlineJustifiedField('client_name', readonly=True),
            Field('client_name'),
            ButtonHolder(
                Submit('Save', 'Save'),
                Button('Cancel', 'Cancel')
            )
        )

        # self.helper.add_input(Submit('submit', 'Submit'))
        super(HeaderForm, self).__init__(*args, **kwargs)
