import random
from rest_framework.response import Response
from rest_framework import status

def standard_response(data=None, message=None, success=True, status_code=status.HTTP_200_OK):
    payload = {
        "success": success,
        "data": data,
    }
    if message:
        payload["message"] = message
    return Response(payload, status=status_code)

def generate_order_code(prefix="UT"):
    number = random.randint(1000, 9999)
    return f"{prefix}-{number}"

def format_uzs(amount):
    try:
        val = int(amount)
        return f"{val:,}".replace(",", " ") + " so‘m"
    except (ValueError, TypeError):
        return str(amount)
