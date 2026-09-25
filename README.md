# Usta Top — Marketplace Platformasi

Usta Top — O‘zbekistondagi ishonchli mahalliy ustalarni (santexnik, elektrik, maishiy texnika ustasi va boshqalar) tez va oson topish, narx takliflarini solishtirish, buyurtmani jonli kuzatish va kafolatli xizmat ko‘rsatish platformasi.

---

## 📁 Loyiha Strukturasi (Clean Monorepo)

Loyiha ikkita asosiy qismdan (bitta frontend va bitta backend) iborat toza arxitekturaga ega:

`	ext
Usta Top/
├── frontend/                     # Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript
│   ├── app/                      # Sahifalar va marshrutlar (19 ta to'liq sahifa)
│   │   ├── page.tsx              # Asosiy landing page
│   │   ├── qidiruv/              # 4 bosqichli muammo diagnostikasi
│   │   ├── ustalar/              # Ustalarni qidirish va moslashtirish natijalari
│   │   │   └── [id]/             # Ali Usta va boshqa ustalar profili, bento-metrikalar
│   │   ├── buyurtmalar/          # Buyurtmalar ro'yxati va #UT-8942 jonli kuzatuv
│   │   ├── provider/             # Usta boshqaruv paneli (dashboard, kalendar, ishlar, daromad)
│   │   ├── admin/                # Admin platforma monitoringi va metrikalari
│   │   ├── auth/                 # Kirish va ro'yxatdan o'tish (SMS/OTP)
│   │   ├── xabarlar/             # Jonli chat va xabarlar
│   │   └── xizmatlar/            # Xizmatlar katalogi
│   ├── components/               # Qayta ishlatiluvchi UI komponentlar
│   ├── docs/                     # Dizayn tizimi va spetsifikatsiyalar (DESIGN.md)
│   ├── lib/                      # API client, auth context va mock-data fallbacks
│   ├── public/                   # Rasmlar, ikonlar va skrinshotlar
│   ├── .env.local                # Frontend muhit o'zgaruvchilari
│   ├── next.config.ts            # API rewrites proxy va rasm optimizatsiyalari
│   └── package.json              # Frontend bog'liqliklari va skriptlari
│
├── backend/                      # Django 5 + Django REST Framework + Celery + PostgreSQL/SQLite
│   ├── apps/                     # 18 ta mustaqil biznes domen modullari
│   │   ├── users/                # Foydalanuvchilar (Customer, Provider, Admin)
│   │   ├── locations/            # O'zbekiston viloyat va tumanlari
│   │   ├── catalog/              # Xizmat toifalari va narxlar
│   │   ├── providers/            # Usta profillari, portfoliosi va tajribasi
│   │   ├── service_requests/     # Mijoz buyurtmalari va so'rovlari
│   │   ├── matching/             # Skoring va eng mos ustalarni tanlash dvigateli
│   │   ├── quotes/               # Smeta takliflari (qabul qilish/rad etish)
│   │   ├── bookings/             # Jonli buyurtma bosqichlari (#UT-8942)
│   │   ├── conversations/        # Chat va xabarlar tizimi
│   │   ├── reviews/              # 5 yulduzli sharhlar va reyting
│   │   ├── favorites/            # Sevimli ustalar
│   │   ├── disputes/             # Kafolat va nizolar boshqaruvi
│   │   ├── verification/         # Usta pasport/hujjat verifikatsiyasi
│   │   ├── notifications/        # Telegram, Push, SMS xabarnomalar
│   │   ├── payments/             # Escrow, Payme va Click to'lovlari
│   │   ├── promotions/           # Promokodlar va aksiyalar
│   │   ├── analytics/            # Admin KPI ko'rsatkichlari
│   │   └── ai_intake/            # AI orqali muammoni tahlil qilish
│   ├── common/                   # Global permissions, pagination, exceptions
│   ├── config/                   # Django settings (base, local, production), URLs, Celery
│   ├── requirements/             # Python paketlari (base, local, production)
│   ├── tests/                    # Pytest testlari (auth, flows, concurrency)
│   ├── db.sqlite3                # Mahalliy ma'lumotlar bazasi (demo ustalar va buyurtmalar yuklangan)
│   ├── Dockerfile                # Backend konteynerizatsiyasi
│   └── manage.py                 # Django CLI
│
├── docker-compose.yml            # PostgreSQL, Redis, Celery, Backend, Nginx to'liq steki
├── package.json                  # Root monorepo boshqaruv skriptlari
├── README.md                     # Ushbu bosh hujjat
└── .gitignore                    # To'liq loyiha uchun gitignore qoidalari
`

---

## 🚀 Tezkor Ishga Tushirish (Quick Start)

### 1-usul: Oddiy Mahalliy Rejim (Tavsiya etiladi)

Root papkada bitta buyruq orqali yoki alohida terminallarda:

#### Frontend:
`ash
cd frontend
npm run dev
# Browser: http://localhost:3000
`

#### Backend:
`ash
cd backend
python manage.py runserver 8000
# API: http://127.0.0.1:8000/api/v1/
# Swagger hujjatlari: http://127.0.0.1:8000/api/docs/
`

> **Eslatma:** Frontend avtomatik ravishda barcha /api/v1/* so'rovlarini Next.js orqali Django backendiga yo'naltiradi (reverse proxy). Backend yoqilmagan holatda ham, frontend o'zining avtonom mock-data ma'lumotlari bilan 100% to'xtovsiz ishlayveradi.

---

### 2-usul: Ngrok orqali Tashqi Tarmoqqa / Telefonga Ulash

Next.js ichiga o'rnatilgan API proxy tufayli, faqat **bitta ngrok tunneli** kifoya:

`ash
cd frontend
npm run tunnel
# yoki: ngrok http 3000 --host-header=rewrite
`

Ngrok taqdim etgan havola (masalan, https://xxxx.ngrok-free.app) orqali ham frontend sahifalari, ham backend API bir xil domen ostida telefoningizda va tashqaridan xatosiz ishlaydi.

---

### 3-usul: Docker Compose orqali To'liq Production Stek

`ash
docker-compose up -d --build
`
PostgreSQL, Redis, Celery Worker, Celery Beat, Django Backend va Nginx to'liq avtomat ishga tushadi.

---

## 🧪 Testlar va Kod Sifatini Tekshirish

- **Frontend Build & Linter**:
  `ash
  cd frontend
  npm run lint
  npm run build
  `
- **Backend Testlar & Linter**:
  `ash
  cd backend
  pytest
  ruff check .
  python manage.py check
  `

---

## 👥 Demo Hisoblar (Seeded Accounts)

Loyiha bazasida quyidagi foydalanuvchilar mavjud:
- **Mijoz:** Sardor A. (+998901234567) — Faol buyurtma: #UT-8942
- **Usta:** Ali Usta (+998939876543) — Santexnika va isitish bo'yicha usta, 4.9 yulduz
- **Admin:** Admin (+998909999999) — Parol: dmin12345



