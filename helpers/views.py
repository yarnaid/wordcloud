from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

# Create your views here.


class LoginMixin(object):
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(LoginMixin, self).dispatch(*args, **kwargs)
