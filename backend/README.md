# Usta Top — Production Backend API (Django REST Framework)

Usta Top — O‘zbekistondagi uy va kundalik xizmatlar bozori (marketplace) uchun professional, toza arxitekturaga ega monolit-modular Django REST Framework backend platformasi.

---

## 1. Loyiha haqida (Overview)
Usta Top platformasi mijozlar va ishonchli mahalliy ustalarni birlashtiradi. Ushbu backend API Next.js 16 frontendining barcha oqimlarini (muammo diagnostikasi, AI tahlil, ustalarni moslashtirish, smeta takliflari, jonli buyurtma kuzatuvi, chat, sharhlar, kafolat nizolari va admin boshqaruvi) to‘liq ta’minlaydi.

---

## 2. Arxitektura (Architecture)
Monolit-modular toza Django arxitekturasi:
- **`config/`**: Loyiha sozlamalari (`settings/base.py`, `local.py`, `production.py`), URLs, Celery, WSGI, ASGI.
- **`apps/`**: Alohida biznes-domenlarga bo‘lingan modullar:
  - `users`: Maxsus User modeli (UUID, telefon raqam, rollar: CUSTOMER, PROVIDER, ADMIN, MODERATOR).
  - `locations`: Viloyat, tuman va foydalanuvchi manzillari.
  - `catalog`: 8 ta xizmat toifalari va ichki xizmatlar.
  - `providers`: Usta profili, bento-metrikalar, xizmatlar va portfolio.
  - `service_requests`: Xizmat buyurtmalari, media ilovalar, statuslar tarixi.
  - `matching`: Ustani moslashtirish va og‘irlik koeffitsiyentlari bo‘yicha skoring dvigateli.
  - `quotes`: Usta smetalari, qabul qilish/rad etish, atomik booking yaratish.
  - `bookings`: Buyurtmalar, jonli avtomobil holati, bosqichlar va konkurent band qilishdan himoya (`select_for_update`).
  - `conversations`: Buyurtma va usta bo‘yicha to‘g‘ridan-to‘g‘ri yozishmalar (Chat).
  - `reviews`: Faqat yakunlangan buyurtmalar uchun 5 yulduzli sharhlar va usta reytingini qayta hisoblash.
  - `favorites`: Tanlangan ustalarni saqlash.
  - `disputes`: Kafolat da’volari va admin vositachiligi.
  - `verification`: Ustalarning pasport/sertifikatlarini tekshirish navbati.
  - `notifications`: Ko‘p kanalli xabarnomalar (In-App, Telegram, Email, Push).
  - `payments`: To‘lov va xavfsiz depozit (Escrow) arxitekturasi, Payme va Click adapterlari.
  - `promotions`: Promokodlar va chegirma qoidalari.
  - `analytics`: Platforma KPI ko‘rsatkichlari.
  - `ai_intake`: Muammoni matn/ovoz orqali tahlil qiluvchi AI intake integratsiyasi.
- **`common/`**: Istisnolar boshqaruvi (`exceptions.py`), ruxsatlar (`permissions.py`), paginatsiya (`pagination.py`), xavfsizlik sarlavhalari (`middleware.py`), audit jurnali (`audit.py`).

---

## 3. Talablar (Requirements)
- Python 3.12+
- PostgreSQL 15+ (yoki lokal sinov uchun avtomatik SQLite)
- Redis 7+
- Celery 5+
- Node.js (Frontend bilan birgalikda ishlatilganda)

---

## 4. Mahaliy Ishga Tushirish (Local Setup)

### 1. Virtual muhit va kutubxonalar:
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements/local.txt
```

### 2. Muhit o‘zgaruvchilarini sozlash:
```bash
cp .env.example .env
```

### 3. Migratsiyalarni qo‘llash:
```bash
python manage.py migrate
```

### 4. Realistik demo ma’lumotlarni yuklash:
```bash
python manage.py seed_demo
```
*(Ushbu buyruq Sardor Alimov (Mijoz), Ali Karimov (Ali Usta), Admin hisobi, 8 ta toifa, #UT-8942 buyurtmasi, smetalar va chat xabarlarini yaratadi).*

### 5. Serverni ishga tushirish:
```bash
python manage.py runserver 8000
```
API manzili: `http://127.0.0.1:8000/api/v1/`
Swagger hujjati: `http://127.0.0.1:8000/api/docs/`
Admin panel: `http://127.0.0.1:8000/admin/`

---

## 5. Celery Ishga Tushirish (Asinxron Vazifalar)

```bash
# Worker:
celery -A config worker --loglevel=info

# Beat (rejalashtirilgan vazifalar):
celery -A config beat --loglevel=info
```

---

## 6. Testlarni Yurgizish (Automated Tests)

```bash
pytest
```
Testlar to‘plami:
- Autentifikatsiya va JWT token aylanishi
- Ustalarni saralash va qidiruv
- Matching dvigateli skoringi
- Smetani qabul qilish va atomik buyurtma yaratish
- Ish bosqichlari va sharh qoldirish
- Takroriy sharh va ruxsatsiz kirish (IDOR/BOLA) himoyasi

---

## 7. Docker Yordamida Ishga Tushirish

Barcha servislar (PostgreSQL, Redis, Django, Celery, Celery-Beat, Nginx) birgalikda:
```bash
docker-compose up --build
```
Nginx orqali API `http://localhost:8000/` manzilida xizmat ko‘rsatadi.

---

## 8. Standart Demo Foydalanuvchilar

- **Mijoz (Customer)**:
  - Telefon: `+998901234567`
  - Parol: `password123`
- **Usta (Provider - Ali Usta)**:
  - Telefon: `+998909876543`
  - Parol: `password123`
- **Administrator (Admin)**:
  - Telefon: `+998990000000`
  - Parol: `admin123`

---

## 9. Assumptions (Qabul qilingan Oqilona Taxminlar)
1. **To‘lovlar (Payments)**: O‘zbekiston sharoitida to‘lovlar asosan Usta Top xavfsiz depoziti (Escrow), Payme va Click orqali amalga oshiriladi. Shuning uchun mustaqil `PaymentGateway` interfeysi qurildi.
2. **AI Tahlili (AI Intake)**: Tashqi API (OpenAI/Claude) o‘chiq yoki kalitsiz bo‘lsa ham mijoz tajribasi to‘xtab qolmasligi uchun aqlli o‘zbekcha kalit so‘zlar leksikoni bilan qurollangan deterministik intake dvigateli birlamchi qilib olindi.
3. **Telegram integratsiyasi**: Alohida adapter orqali `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` berilganda buyurtma xabarlarini bevosita Telegram kanaliga yuboradi.

---

## 10. Known Limitations (Mavjud Cheklovlar)
1. Jonli chat REST polling orqali to‘liq ishlaydi. Kelajakda Django Channels + Redis WebSockets to‘liq oqimga ulanishi mumkin (barcha ma’lumotlar bazasi modellari shunga moslangan).
2. Xarita koordinatalari Toshkent shahri bo‘yicha aniq lat/long decimal shaklida saqlanadi. Kelajakda PostGIS fazoviy indekslariga oson ko‘chiriladi.
