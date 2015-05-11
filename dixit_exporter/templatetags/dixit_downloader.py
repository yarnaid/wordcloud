from django import template

register = template.Library()


@register.inclusion_tag('dixit_exporter/downloader.html', takes_context=True)
def downloader(context):
    return context
