import logging
from rest_framework import status
from rest_framework.exceptions import (
    AuthenticationFailed,
    NotAuthenticated,
    PermissionDenied,
    NotFound,
    ValidationError,
    Throttled,
)
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)

class BusinessLogicError(Exception):
    """Base exception for application business rule violations."""
    code = "BUSINESS_ERROR"
    status_code = status.HTTP_400_BAD_REQUEST

    def __init__(self, message, code=None, details=None, status_code=None):
        super().__init__(message)
        self.message = message
        if code:
            self.code = code
        self.details = details or {}
        if status_code:
            self.status_code = status_code

class InvalidStatusTransitionError(BusinessLogicError):
    code = "INVALID_STATUS_TRANSITION"

class BookingConflictError(BusinessLogicError):
    code = "BOOKING_CONFLICT"
    status_code = status.HTTP_409_CONFLICT

class QuoteExpiredError(BusinessLogicError):
    code = "QUOTE_EXPIRED"

def custom_exception_handler(exc, context):
    if isinstance(exc, BusinessLogicError):
        return Response(
            {
                "success": False,
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                    "details": exc.details,
                },
            },
            status=exc.status_code,
        )

    response = exception_handler(exc, context)

    if response is not None:
        error_code = "SERVER_ERROR"
        message = "Xatolik yuz berdi"
        details = {}

        if isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
            error_code = "AUTH_REQUIRED"
            message = "Tizimga kirish talab etiladi"
        elif isinstance(exc, PermissionDenied):
            error_code = "PERMISSION_DENIED"
            message = "Ushbu amalni bajarish uchun ruxsat yetarli emas"
        elif isinstance(exc, NotFound):
            error_code = "RESOURCE_NOT_FOUND"
            message = "So‘ralgan ma’lumot topilmadi"
        elif isinstance(exc, ValidationError):
            error_code = "VALIDATION_ERROR"
            message = "Kiritilgan ma’lumotlar noto‘g‘ri"
            details = response.data
        elif isinstance(exc, Throttled):
            error_code = "RATE_LIMITED"
            message = "So‘rovlar soni oshib ketdi. Iltimos birozdan so‘ng urinib ko‘ring"

        response.data = {
            "success": False,
            "error": {
                "code": error_code,
                "message": message,
                "details": details or response.data,
            },
        }
        return response

    logger.exception("Kutilmagan server xatoligi: %s", exc)
    return Response(
        {
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Ichki server xatoligi yuz berdi. Iltimos keyinroq urinib ko‘ring.",
                "details": {},
            },
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
