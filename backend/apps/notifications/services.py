import logging
import os
import requests
from .models import Notification

logger = logging.getLogger(__name__)

def send_telegram_message(text: str, chat_id: str = None):
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    target_chat = chat_id or os.getenv("TELEGRAM_CHAT_ID")
    if not bot_token or not target_chat:
        return False
    try:
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        resp = requests.post(url, json={"chat_id": target_chat, "text": text, "parse_mode": "HTML"}, timeout=5)
        return resp.status_code == 200
    except Exception as e:
        logger.warning(f"Telegram yuborishda xatolik: {e}")
        return False

def create_notification(user, notification_type: str, title: str, body: str, data: dict = None, channels=("IN_APP",)):
    # 1. In-app notification
    notif = Notification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        body=body,
        data=data or {},
    )

    # 2. Telegram channel adapter (if enabled)
    if "TELEGRAM" in channels:
        send_telegram_message(f"<b>{title}</b>\n\n{body}")

    return notif
