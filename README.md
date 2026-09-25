# Usta Top — Ishonchli Mahalliy Ustalar Platformasi

<p align="center">
  <b>O‘zbekistondagi malakali va tekshirilgan ustalarni topish, narx takliflarini solishtirish hamda buyurtmalarni jonli kuzatish bo'yicha zamonaviy xizmatlar bozori (marketplace).</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Django-5.2-092E20?logo=django" alt="Django">
  <img src="https://img.shields.io/badge/Django_REST-Framework-red?logo=django" alt="DRF">
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ed?logo=docker" alt="Docker">
</p>

---

## 📌 Asosiy Xususiyatlar

- 🔍 **4 bosqichli intellektual muammo diagnostikasi:** mijoz muammosini aniqlash, rasm/audio yuklash va lokatsiyani ko'rsatish.
- 👨‍🔧 **Tekshirilgan ustalar katalogi:** yulduzlar reytingi, mijozlar sharhlari, portfolio va bento-metrikalar.
- 📋 **Smeta va narx takliflari (Quotes):** ustalardan takliflar olish, ularni solishtirish va eng maqbulini tanlash.
- 📍 **Jonli buyurtma kuzatish:** buyurtma holati (`Kutilmoqda` → `Qabul qilindi` → `Yo'lda` → `Bajarilmoqda` → `Yakunlandi`), usta lokatsiyasi va xaritadagi kuzatuv.
- 💬 **Jonli xabarlar (Chat):** mijoz va usta o'rtasida to'g'ridan-to'g'ri xabar almashish.
- 🛡️ **Kafolatlangan xavfsizlik:** IDOR himoyasi, xavfsiz JWT autentifikatsiya, pasport verifikatsiyasi va ruxsatlar nazorati.
- 📊 **Usta & Admin panellari:** daromadlar tahlili, ishlar taqvimi, yangi so'rovlar va platforma ko'rsatkichlari.

---

## 📁 Loyiha Arxitekturasi

Loyiha toza monorepo arxitekturasida tuzilgan:

```text
Usta-Top/
├── frontend/                     # Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript
│   ├── app/                      # Marshrutlar (19 ta sahifa)
│   │   ├── page.tsx              # Asosiy landing sahifa
│   │   ├── qidiruv/              # 4 bosqichli muammo diagnostikasi
│   │   ├── ustalar/              # Ustalar katalogi va qidiruv
│   │   │   └── [id]/             # Usta profili va bento-metrikalar
│   │   ├── buyurtmalar/          # Buyurtmalar ro'yxati
│   │   │   └── [id]/             # Buyurtmani jonli kuzatish
│   │   ├── provider/             # Usta kabineti (dashboard, ishlar, kalendar, daromad)
│   │   ├── admin/dashboard/      # Admin monitoring va verifikatsiya
│   │   ├── auth/                 # Kirish va ro'yxatdan o'tish (login, register)
│   │   ├── xabarlar/             # Chat interfeysi
│   │   ├── xizmatlar/            # Xizmat toifalari
│   │   └── profil/               # Mijoz profili
│   ├── components/               # Qayta ishlatiluvchi UI komponentlar
│   ├── lib/                      # API client, Auth konteksti va ma'lumotlar
│   ├── public/                   # Rasmlar, ikonlar va bannerlar
│   └── package.json              # Frontend bog'liqliklari
│
├── backend/                      # Django 5 + Django REST Framework + Celery + PostgreSQL
│   ├── apps/                     # Modulli biznes domenlari
│   │   ├── users/                # Foydalanuvchilar (Mijoz, Usta, Admin), JWT auth
│   │   ├── providers/            # Usta profillari, portfoliosi va tajribasi
│   │   ├── service_requests/     # Mijoz buyurtmalari va so'rovlari
│   │   ├── quotes/               # Usta takliflari va smetalar
│   │   ├── bookings/             # Jonli buyurtmalar va status mashinasi
│   │   ├── categories/           # Xizmat toifalari va narxlar
│   │   ├── reviews/              # Sharhlar va reyting tizimi
│   │   ├── verification/         # Hujjat va pasport verifikatsiyasi
│   │   ├── payments/             # Escrow, Payme va Click integratsiyasi
│   │   └── notifications/        # Xabarnomalar tizimi
│   ├── config/                   # Django sozlamalari (base, local, production), URLs, Celery
│   ├── tests/                    # Pytest biznes-flow va xavfsizlik testlari
│   ├── requirements/             # Python paketlari
│   └── manage.py                 # Django CLI
│
├── docker-compose.yml            # PostgreSQL, Redis, Celery, Backend, Nginx to'liq steki
├── package.json                  # Root skriptlar
├── README.md                     # Bosh hujjat
└── .gitignore                    # Git qoidalari
```

---

## 🚀 Tezkor Ishga Tushirish

### 1-usul: Mahalliy Rejim (Tavsiya etiladi)

#### 1. Backendni ishga tushirish:
```bash
cd backend

# Kutubxonalarni o'rnatish
pip install -r requirements/local.txt

# Migratsiyalarni o'tkazish
python manage.py migrate

# Demo ma'lumotlarni bazaga yuklash
python manage.py seed_demo

# Serverni yoqish
python manage.py runserver 8000
```
- **API manzili:** `http://127.0.0.1:8000/api/v1/`
- **Swagger hujjatlari:** `http://127.0.0.1:8000/api/docs/`

#### 2. Frontendni ishga tushirish (alohida terminalda):
```bash
cd frontend

# Paketlarni o'rnatish
npm install

# Dasturni ishlab chiquvchi rejimida yoqish
npm run dev
```
- **Brauzerda ochish:** `http://localhost:3000`

> **Eslatma:** Frontend barcha `/api/v1/*` so'rovlarini Next.js orqali avtomatik ravishda Django serveriga yo'naltiradi (reverse proxy).

---

### 2-usul: Ngrok orqali Telefonda Ishlatish

Next.js ichidagi avtomatik proxy tufayli faqat bitta tunnel yetarli:

```bash
cd frontend
npm run tunnel
# yoki: ngrok http 3000 --host-header=rewrite
```

Ngrok taqdim qilgan havola (masalan, `https://xxxx.ngrok-free.app`) orqali kompyuterdan ham, telefondan ham platformani to'liq ishlatish mumkin.

---

### 3-usul: Docker Compose orqali To'liq Stek

```bash
docker-compose up -d --build
```
PostgreSQL 16, Redis 7, Celery Worker, Celery Beat, Django Backend va Nginx to'liq avtomatik tarzda ishga tushadi.

---

## 🧪 Testlar va Kod Sifati

Loyihada barcha asosiy oqimlar va kod standartlari to'liq sinovdan o'tgan:

```bash
# Frontend tekshiruvi:
cd frontend
npm run lint      # 0 ta xato
npm run build     # 19 ta sahifa to'liq kompilatsiya bo'ladi

# Backend tekshiruvi:
cd backend
ruff check .               # Kod sifatini tekshirish (All checks passed!)
python manage.py check     # Django tizim tekshiruvi (0 issues)
pytest                     # 9 ta integratsiya va xavfsizlik testlari (100% pass)
```

---

## 👥 Demo Hisoblar (Seeded Accounts)

Loyiha bazasidagi tayyor foydalanuvchilar:

| Rol | Ism / Profil | Telefon | Parol / Izoh |
| :--- | :--- | :--- | :--- |
| **Mijoz** | Sardor A. | `+998901234567` | Faol buyurtma: `#UT-8942` |
| **Usta** | Ali Usta | `+998939876543` | Santexnika va isitish bo'yicha mutaxassis, 4.9 ★ |
| **Admin** | Admin | `+998909999999` | `admin12345` (Boshqaruv paneli uchun) |

---

## 📄 Litsenziya

Ushbu loyiha xususiy mulk hisoblanadi. Barcha huquqlar himoyalangan.
