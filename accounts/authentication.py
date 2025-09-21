from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny

class OptionalJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Skip authentication if endpoint allows unauthenticated access
        try:
            view = request.resolver_match.func.cls
            if AllowAny in getattr(view, 'permission_classes', []):
                return None
        except Exception:
            pass

        return super().authenticate(request)
