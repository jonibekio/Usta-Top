import os
import re
from django.core.exceptions import ValidationError

PHONE_REGEX = re.compile(r"^\+998\d{9}$")

def validate_uz_phone(value):
    clean_val = re.sub(r"[\s\-\(\)]", "", value)
    if not clean_val.startswith("+998"):
        if clean_val.startswith("998"):
            clean_val = f"+{clean_val}"
        elif len(clean_val) == 9:
            clean_val = f"+998{clean_val}"
    if not PHONE_REGEX.match(clean_val):
        raise ValidationError("Telefon raqami +998XXXXXXXXX formatida bo‘lishi kerak.")
    return clean_val

ALLOWED_EXTENSIONS = {
    "image": [".jpg", ".jpeg", ".png", ".webp", ".svg"],
    "document": [".pdf", ".doc", ".docx", ".jpg", ".png"],
    "audio": [".mp3", ".wav", ".m4a", ".ogg", ".aac"],
}

def validate_file_upload(file_obj, file_category="image", max_mb=10):
    if file_obj.size > max_mb * 1024 * 1024:
        raise ValidationError(f"Fayl hajmi {max_mb} MB dan oshmasligi kerak.")

    ext = os.path.splitext(file_obj.name)[1].lower()
    allowed = ALLOWED_EXTENSIONS.get(file_category, ALLOWED_EXTENSIONS["image"])
    if ext not in allowed:
        raise ValidationError(f"Ruxsat etilmagan fayl turi ({ext}). Faqat quyidagilarga ruxsat berilgan: {', '.join(allowed)}")
