# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
"""
Django settings for wordcloud project.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
from django.utils.translation import ugettext_lazy as _
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 't@dpxuj8i5&uh+&v#(z7+&x@$g#-^7%tk-$@ker9rc8_t#z#ph'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
DEBUG_PANEL = not False

TEMPLATE_DEBUG = DEBUG

ALLOWED_HOSTS = ['*']
INTERNAL_IPS = ['*', '0.0.0.0', '127.0.0.1']

SITE_ID = 1
COMMENTS_XTD_CONFIRM_EMAIL = True

# Application definition

INSTALLED_APPS = (
    'modeltranslation',
    'grappelli.dashboard',
    'grappelli',
    'filebrowser',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'reversion',
    'rest_framework',
    # 'livereload',
    'sekizai',
    'wordcloud',
    'jquery',
    'bootstrap3',
    'cloud',
    'wordle',
    'dixit_exporter',
    'c_tree',
    'helpers',
    'pricing_tool',
    'crispy_forms',
    'django_tables2',
    'data_app',
    'color_widget',
    'django_markup',
    'disqus',
    'django_extensions',
    'data_filter',
)


MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    # 'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # 'livereload.middleware.LiveReloadScript',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
)

if DEBUG_PANEL:
    INSTALLED_APPS = INSTALLED_APPS + ('debug_toolbar',)
    MIDDLEWARE_CLASSES = ('debug_toolbar.middleware.DebugToolbarMiddleware',) + MIDDLEWARE_CLASSES

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'sekizai.context_processors.sekizai',
                'django.core.context_processors.request',
            ],
        },
    },
]
ROOT_URLCONF = 'wordcloud.urls'

WSGI_APPLICATION = 'wordcloud.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

LANGUAGES = (
  ('en', _('English')),
  ('fr', _('French')),
  # ('de', _('German')),
  ('sp', _('Spanish')),
  # ('ru', _('Russian')),
)

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = 'media'

FILEBROWSER_STRICT_PIL = True

# Static asset configuration
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'wordcloud/../static'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # 'djangobower.finders.BowerFinder',
    # 'compressor.finders.CompressorFinder',
)

# Parse database configuration from $DATABASE_URL
import dj_database_url
if DEBUG is False:
    DATABASES['default'] = dj_database_url.config()

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

USE_THOUSAND_SEPARATOR = True
GRAPPELLI_INDEX_DASHBOARD = 'wordcloud.dashboard.CustomIndexDashboard'
TITLE = _('Dixit Explicit Cloud')

STUB = 'stubs'
SAMPLE_NAME = 'sample.json'
LEX_NAME = 'lex.json'

STUDY_TYPES = (
    ('l', _('LEX')),
    ('l9', _('LINK 9')),
    ('l7', _('LINK 7')),
    ('l12', _('LINK 12')),
    ('ac', _('Adcheck')),
    ('ah', _('Ad`hock')),
)

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAdminUser',),
    # 'PAGE_SIZE': 10,
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',),
}
# Default layout to use with "crispy_forms"
CRISPY_TEMPLATE_PACK = 'bootstrap3'
DISQUS_API_KEY = 'UMEIxG4BoKA5i2k29rjEjcAWepfR4YZItxSuNZtjI4ZOendtjOsCUcqeMz3nUL1c'
DISQUS_WEBSITE_SHORTNAME = 'dixit'
