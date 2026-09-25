from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "CUSTOMER")

class IsProvider(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "PROVIDER")

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == "ADMIN" or request.user.is_staff))

class IsModerator(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and
            (request.user.role in ("ADMIN", "MODERATOR") or request.user.is_staff)
        )

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and (request.user.role == "ADMIN" or request.user.is_staff))

class IsRequestOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role == "ADMIN":
            return True
        customer = getattr(obj, "customer", None)
        return bool(customer and customer == request.user)

class IsBookingParticipant(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role == "ADMIN":
            return True
        return bool(
            obj.customer == request.user or
            (hasattr(obj, "provider") and obj.provider.user == request.user)
        )

class IsConversationParticipant(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role == "ADMIN":
            return True
        return obj.participants.filter(user=request.user).exists()
