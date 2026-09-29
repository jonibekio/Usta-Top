# 🛠️ Usta Top — O‘zbekiston Xizmatlar Bozori (Marketplace)

<p align="center">
  <b>O‘zbekistondagi malakali, tekshirilgan va ishonchli ustalarni topish, to‘g‘ridan-to‘g‘ri buyurtma berish hamda xizmat jarayonini jonli kuzatish bo‘yicha to‘liq funksional marketplace platformasi.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.2-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Django-5.2-092E20?logo=django" alt="Django">
  <img src="https://img.shields.io/badge/Django_REST-Framework-red?logo=django" alt="DRF">
  <img src="https://img.shields.io/badge/Status-Production--Ready-success" alt="Status">
</p>

---

## 🌟 Asosiy Xususiyatlar va Tizimlar

### 1. 📍 Hududlar va Lokatsiya Ierarxiyasi
- O‘zbekistonning barcha **14 ta viloyat/respublikasi**, **201 ta tumani** va **678 ta mahallasi** to‘liq ma’lumotlar bazasida ierarxik saqlangan.
- Sayt bosh sahifasi va yuqori menyudagi **Lokatsiya tanlash modali** orqali viloyat va tuman tanlanganda butun sayt bo‘ylab ustalar avtomatik saralanadi va brauzerda eslab qolinadi.

### 2. 🔍 Multi-kriteriyali Usta Qidiruv va Filter
- **Xizmat turi:** Santexnika, Elektr montaj, Konditsioner, Maishiy texnika, Mebel, Klining, Pardozlash va Qulf ochish.
- **Hududiy qidiruv:** Viloyat va tanlangan viloyatga mos tumanlar dinamik ro‘yxati.
- **Kengaytirilgan filtrlar:** Narx oralig‘i, Minimal reyting (4.0+, 4.5+, 4.8+), Ish tajribasi (1+, 3+, 5+, 10+ yil) hamda faqat tasdiqlangan ustalar.
- **Tartiblash:** Reyting, Narx (arzondan qimmatga / qimmatdan arzonga), Tajriba va Bajarilgan ishlar soni bo‘yicha.

### 3. 📅 To‘g‘ridan-to‘g‘ri Buyurtma Berish (Direct Booking Flow)
- Mijoz usta profilidan yoki katalog kartochkasidan to‘g‘ridan-to‘g‘ri **"Buyurtma berish"** modalini ochadi.
- **Buyurtma parametrlari:** Ustaning aniq xizmati (narxi bilan), qulay kuni, vaqt oralig‘i, saqlangan yoki yangi manzil, muammo tavsifi.
- **Statuslar mashinasi:** `Yangi (CREATED)` → `Tasdiqlandi (CONFIRMED)` → `Yo‘lda (IN_TRANSIT)` → `Jarayonda (IN_PROGRESS)` → `Yakunlandi (COMPLETED)` → `Bekor qilindi (CANCELLED)`.

### 4. 💬 Mijoz ↔ Usta Jonli Chat (Real-time Messaging)
- Real-vaqt rejimida avtomatik polling (xabarlar har 3 soniyada, suhbatlar ro‘yxati har 8 soniyada yangilanadi).
- Xabarlar tarixi, vaqt belgilari va o‘qilganlik holatlari saqlanadi.

### 5. ⭐ Reyting va Haqiqiy Sharhlar Tizimi
- Buyurtma yakunlangach (`COMPLETED`), mijoz ustaga 1–5 yulduz va batafsil sharh qoldiradi.
- Ustaning o‘rtacha reytingi va sharhlar soni backendda avtomatik qayta hisoblanadi.

### 6. 👤 Mijoz Hisob Markazi (Customer Hub — `/profil`)
- **Shaxsiy ma‘lumotlar:** Ism, telefon va profil tahrirlash.
- **Saqlangan manzillar:** Bir nechta manzil (viloyat, tuman, xonadon, mo‘ljal) qo‘shish va asosiy manzilni belgilash.
- **Sevimli ustalar:** Saqlab qo‘yilgan ustalar ro‘yxati va tezkor buyurtma berish.
- **Bildirishnomalar:** Buyurtma statusi o‘zgarishi va xabarnomalar tarixi.

### 7. 👨‍🔧 Usta Ish Stoli (Provider Workstation — `/provider/jobs`)
- Yangi kelgan buyurtmalarni ko‘rish va **"Qabul qilish"** yoki **"Rad etish"**.
- Ish statusini navbatma-navbat oldinga siljitish (`Yo‘lga chiqish` → `Ishni boshlash` → `Yakunlash`).
- Har bir status yangilanganda mijozga avtomatik real bildirishnoma yuboriladi.

### 8. 🛡️ Alohida Himoyalangan Admin Portali
- **Yopiq kirish:** Maxsus `http://localhost:3000/admin/login` orqali faqat `ADMIN` roliga ega foydalanuvchilar kira oladi.
- **Qattiq himoya (Route Guard):** Begona foydalanuvchilar `/admin/dashboard`ga kirishga uringanda darhol login sahifasiga yo‘naltiriladi.
- **Dashboard imkoniyatlari:** Real platforma KPI metrikalari, ustalarni tekshirish va tasdiqlash arizalari (Approve / Reject), barcha buyurtmalar monitoringi va ustalar nazorati.

---

## 👥 Demo Hisoblar (Test Uchun Login va Parollar)

| Rol | Ism | Telefon raqam | Parol | Asosiy sahifasi |
| :--- | :--- | :--- | :--- | :--- |
| **Mijoz** | Sardor Alimov | `+998901234567` (yoki `901234567`) | `pass1234` | [/profil](http://localhost:3000/profil) & [/buyurtmalar](http://localhost:3000/buyurtmalar) |
| **Usta** | Ali Karimov | `+998909876543` (yoki `909876543`) | `pass1234` | [/provider/jobs](http://localhost:3000/provider/jobs) |
| **Admin** | Admin UstaTop | `+998900000000` (yoki `900000000`) | `admin1234` | [/admin/login](http://localhost:3000/admin/login) → [/admin/dashboard](http://localhost:3000/admin/dashboard) |

---

## 📁 Loyiha Strukturasi (Monorepo)

```text
Usta-Top/
├── frontend/                     # Next.js 16.3 + React 19 + Tailwind v4 + TypeScript
│   ├── app/                      # 20 ta to‘liq kompilatsiya bo‘lgan sahifa
│   │   ├── page.tsx              # Asosiy landing sahifa (qidiruv, toifalar, mutaxassislar)
│   │   ├── ustalar/              # Ustalar katalogi, lokatsiya filtri va saralash
│   │   │   └── [id]/             # Usta to‘liq profili, xizmatlari, portfolio, sharhlar
│   │   ├── buyurtmalar/          # Buyurtmalar ro‘yxati
│   │   │   └── [id]/             # Buyurtma jonli kuzatuvi va sharh qoldirish
│   │   ├── xabarlar/             # Real-vaqt chat va muloqot oynasi
│   │   ├── xizmatlar/            # Xizmat toifalari
│   │   ├── profil/               # Mijoz hisobi (manzillar, sevimlilar, bildirishnomalar)
│   │   ├── admin/
│   │   │   ├── login/            # Himoyalangan Admin kirish portali
│   │   │   └── dashboard/        # Admin monitoring va verifikatsiya
│   │   ├── provider/             # Usta kabineti (ishlar stoli, daromad, so‘rovlar)
│   │   └── auth/                 # Mijoz va usta kirish/ro‘yxatdan o‘tish
│   ├── components/               # UI komponentlar (BookingModal, LocationSelector, Notifications)
│   ├── lib/                      # API mijozlari, Auth konteksti va Lokatsiya boshqaruvi
│   └── types/                    # TypeScript tiplari
│
├── backend/                      # Django 5 + Django REST Framework + Celery
│   ├── apps/
│   │   ├── users/                # Custom User modeli (Phone auth, JWT, rollar)
│   │   ├── locations/            # Viloyat, tuman, mahalla va saqlangan manzillar
│   │   ├── catalog/              # Kategoriya va xizmatlar
│   │   ├── providers/            # Usta profillari, portfoliosi va narxlari
│   │   ├── bookings/             # Buyurtmalar boshqaruvi va status mashinasi
│   │   ├── conversations/        # Suhbatlar va xabarlar
│   │   ├── reviews/              # Sharhlar va reyting hisoblash
│   │   ├── favorites/            # Sevimli ustalarni saqlash
│   │   ├── notifications/        # Xabarnomalar tizimi
│   │   ├── verification/         # Hujjat va pasport verifikatsiyasi
│   │   └── analytics/            # Admin va platforma statistikasi
│   ├── config/                   # Django sozlamalari va API marshrutlari
│   └── manage.py
│
├── README.md                     # Ushbu bosh hujjat
└── package.json
```

---

## 🚀 O‘rnatish va Ishga Tushirish

### 1. Backendni ishga tushirish:
```bash
cd backend

# Virtual muhitni faollashtirish
source .venv/bin/activate  # yoki: python -m venv .venv && source .venv/bin/activate

# Kerakli paketlarni o‘rnatish
pip install -r requirements/local.txt

# Ma’lumotlar bazasi migratsiyalari
python manage.py migrate

# O‘zbekiston hududlari, xizmatlar va demo oqimini bazaga yuklash:
python manage.py seed_locations      # 14 viloyat, 201 tuman, 678 mahalla
python manage.py seed_marketplace    # 30 ta xizmat va ustalar
python manage.py seed_demo_flow      # Sardor Alimov va Ali Karimov buyurtmalari, chat, manzillari

# Backend serverni yoqish (Port: 8000)
python manage.py runserver 127.0.0.1:8000
```
- **API bazasi:** `http://127.0.0.1:8000/api/v1/`
- **Swagger API hujjatlari:** `http://127.0.0.1:8000/api/docs/`
- **Django Admin:** `http://127.0.0.1:8000/admin/`

---

### 2. Frontendni ishga tushirish (alohida terminalda):
```bash
cd frontend

# Paketlarni o‘rnatish
npm install

# Ishlab chiquvchi (Dev) rejimida yoqish:
npm run dev

# Yoki Production build qilib yoqish:
npm run build
npm run start
```
- **Web-sayt:** `http://localhost:3000`
- **Admin portali:** `http://localhost:3000/admin/login`

---

## 🔒 Xavfsizlik va Arxitektura Qoidalari
- **Haqiqiy backend integratsiyasi:** Barcha sahifalar to‘liq REST API endpointlari bilan ishlaydi, hardcoded demo ma’lumotlar ishlatilmaydi.
- **JWT Autentifikatsiya:** Tokenlar xavfsiz boshqariladi va refresh-token mexanizmi orqali yangilanadi.
- **Ruxsatlar nazorati (RBAC):** Mijoz, Usta va Admin o‘rtasidagi huquqlar backend darajasida qat’iy tekshiriladi (`IsCustomer`, `IsProvider`, `IsAdmin`).

---

## 📄 Litsenziya
Ushbu loyiha mualliflik huquqi bilan himoyalangan. Barcha huquqlar saqlangan.
