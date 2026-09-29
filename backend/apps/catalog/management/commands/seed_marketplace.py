from django.core.management.base import BaseCommand
from django.db import transaction
from apps.users.models import User
from apps.locations.models import Region, District
from apps.catalog.models import ServiceCategory, Service
from apps.providers.models import ProviderProfile, ProviderService, ProviderPortfolio

MARKETPLACE_SERVICES = {
    "santexnika": [
        ("Kran va smesitel o‘rnatish / ta’mirlash", "kran-smesitel", 90000, "Barcha turdagi kranlar, dush panellari va smesitellarni sifatli montaj qilish."),
        ("Unitaz va bide o‘rnatish / ta’mirlash", "unitaz-ornatish", 150000, "Unitaz, bide va dush kabinalarini germetik o‘rnatish."),
        ("Kanalizatsiya quvurlarini tozalash (tiqilma)", "kanalizatsiya-tozalash", 120000, "Zamonaviy pnevmatik va trosli uskunalar bilan har qanday tiqilmani ochish."),
        ("Plastik va metall quvurlarni almashtirish", "quvur-almashtirish", 250000, "Issiq va sovuq suv quvurlarini polipropilen bilan yangilash."),
        ("Suv isitgich (Ariston / Boiler) montaji", "ariston-montaj", 180000, "Ariston, boiler va qozonxona tizimlarini xavfsiz ulash."),
    ],
    "elektrik": [
        ("Qisqa tutashuv va nosozlikni aniqlash", "qisqa-tutashuv", 100000, "Elektr tarmog‘idagi uzilish va qisqa tutashuvlarni zamonaviy asboblar bilan topish."),
        ("Rozetka va viklyuchatel o‘rnatish", "rozetka-ornatish", 40000, "Zamonaviy va xavfsiz rozetka, avtomat va shchitlarni yig‘ish."),
        ("Lyustra va yoritgichlar o‘rnatish", "lyustra-ornatish", 90000, "Har qanday og‘irlikdagi lyustra, bra va LED chiroqlarni shiftga o‘rnatish."),
        ("Xonadon elektr simlarini to‘liq yangilash", "elektr-montaj-toliq", 1200000, "G‘isht va beton devorlarda kabel kanallarini ochish va xavfsiz montaj."),
    ],
    "konditsioner": [
        ("Konditsionerni yuvish va antibakterial tozalash", "konditsioner-yuvish", 120000, "Ichki va tashqi blokni maxsus karcher va kimyoviy vositalar bilan chuqur tozalash."),
        ("Freon gazini to‘ldirish (R410A / R22 / R32)", "freon-toldirish", 180000, "Manometr orqali aniq bosim o‘lchab original freon quyish."),
        ("Konditsioner montaji va demontaji", "konditsioner-montaj", 300000, "Magistral trassalarni tortish va xavfsiz devorga qotirish."),
        ("Kompressor va elektron plata ta’miri", "konditsioner-plata", 250000, "Inverter va standart modellar elektronikasini diagnostika qilish."),
    ],
    "maishiy-texnika": [
        ("Kir yuvish mashinasini ta’mirlash", "kir-yuvish-tamirlash", 130000, "Suv isitmaslik, shovqin, suv chiqarmaslik nosozliklarini bartaraf etish."),
        ("Muzlatgichni ta’mirlash", "muzlatgich-tamirlash", 150000, "Freon sizishi, termostat, nofrost datchik va kompressor almashtirish."),
        ("Gaz plitasi va duxovka sozlash", "gaz-plita-sozlash", 90000, "Forsunkalar, termopara va elektr podjigni tozalash va sozlash."),
        ("Idish yuvish mashinasini tuzatish", "idish-yuvish-tamirlash", 140000, "Nasos, filtr va klapanlarni professional almashtirish."),
    ],
    "pardozlash": [
        ("Kafel va keramo-granit yotqizish", "kafel-terish", 90000, "Kafel, mozaika va yirik plitalarni lazerli daraja bilan terish (kv.m)."),
        ("Shpatlyovka va devor bo‘yash", "shpatlyovka-boyash", 35000, "Devorlarni tekislash, astar surtish va sifatli bo‘yash (kv.m)."),
        ("Gipsokarton shift va peregorodkalar", "gipsokarton-montaj", 60000, "Bir va ko‘p pog‘onali shiftlar, dizaynerlik arkalari."),
        ("Laminat va pol qoplamalari yotqizish", "laminat-yotqizish", 30000, "Taglik yoyish, laminat, parket va plintuslarni montaj qilish."),
    ],
    "mebel": [
        ("Shkaf va oshxona garniturini yig‘ish", "oshxona-mebel-yigish", 250000, "Yangi sotib olingan yoki ko‘chirilgan mebellarni chizma bo‘yicha yig‘ish."),
        ("Yumshoq mebel ta’mirlash va qoplama almashtirish", "mebel-qoplama", 300000, "Divan, kreslo va stullarning poroloni va matosini yangilash."),
        ("Mebel petlya, mexanizm va furnituralarini sozlash", "mebel-sozlash", 80000, "Shkaf eshiklari, tortmalar va lift mexanizmlarini almashtirish."),
    ],
    "tozalash": [
        ("Xonadonlarni to‘liq klining tozalash", "xonadon-klining", 350000, "Remontdan keyingi yoki umumiy chuqur klining xizmati."),
        ("Yumshoq mebel va gilamlarni ximchistka qilish", "mebel-ximchistka", 180000, "Ekologik xavfsiz nemis vositalari bilan divan va gilamlarni dog‘siz tozalash."),
        ("Panoramik va standart derazalarni yuvish", "deraza-yuvish", 90000, "Karcher apparati bilan deraza romlari va oynalarni yuvish."),
    ],
    "qulf-ochish": [
        ("Eshik qulfini zararsiz ochish", "qulf-ochish-zararsiz", 150000, "Kalit yo‘qolganda yoki ichida sinib qolganda eshikka zarar yetkazmasdan ochish."),
        ("Yangi qulf va lichinka o‘rnatish", "qulf-almashtirish", 120000, "Cisa, Kale, Mottura, Apecs qulflarini kafolatli o‘rnatish."),
        ("Avtomobil eshigini ochish", "avto-qulf-ochish", 200000, "Akumulyator o‘tirib qolgan yoki kalit ichkarida qolgan avtomobillarni ochish."),
    ],
}

SEED_PROVIDERS = [
    {
        "phone": "+998901112201",
        "name": "Nodirbek Yoqubov",
        "title": "Oliy toifali santexnik muhandis",
        "short_title": "Santexnik",
        "category_slug": "santexnika",
        "city": "Toshkent shahri",
        "district_slug": "toshkent-shahri-chilonzor",
        "district_text": "Chilonzor tumani",
        "experience": 9,
        "rating": 4.95,
        "jobs": 142,
        "price_min": 90000,
        "price_max": 400000,
        "about": "9 yillik tajribaga ega usta. Germaniya va Turkiya uskunalari bilan ishlayman. Har bir bajargan ishimga 1 yillik rasmiy kafolat beraman. Smesitel, quvurlar, unitaz va isitish tizimlari montaji.",
        "avatar": "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&h=400&fit=crop",
    },
    {
        "phone": "+998901112202",
        "name": "Bobur Mirzayev",
        "title": "Professional elektr montajchi usta",
        "short_title": "Elektrik",
        "category_slug": "elektrik",
        "city": "Toshkent shahri",
        "district_slug": "toshkent-shahri-yunusobod",
        "district_text": "Yunusobod tumani",
        "experience": 7,
        "rating": 4.92,
        "jobs": 118,
        "price_min": 80000,
        "price_max": 350000,
        "about": "Xonadonlar, kottejlar va ofislarda elektr montaj ishlari. Qisqa tutashuvni aniqlash, lyustralar, avtomat shchitlari va kuchlanish relesi o‘rnatish. Xavfsizlik birinchi o‘rinda.",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
        "phone": "+998901112203",
        "name": "Rustam Rustamov",
        "title": "Konditsioner servis va freon bo‘yicha usta",
        "short_title": "Konditsioner ustasi",
        "category_slug": "konditsioner",
        "city": "Samarqand viloyati",
        "district_slug": "samarqand-viloyati-samarqand-shahri",
        "district_text": "Samarqand shahri",
        "experience": 8,
        "rating": 4.88,
        "jobs": 94,
        "price_min": 100000,
        "price_max": 450000,
        "about": "Samarqand shahri va atrofida barcha brenddagi konditsionerlarni yuvish, freon quyish, montaj va platasini sozlash. Toza va tartibli ishlayman.",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
        "phone": "+998901112204",
        "name": "Javlon Saidov",
        "title": "Maishiy texnika bosh mutaxassisi",
        "short_title": "Maishiy texnika ustasi",
        "category_slug": "maishiy-texnika",
        "city": "Buxoro viloyati",
        "district_slug": "buxoro-viloyati-buxoro-shahri",
        "district_text": "Buxoro shahri",
        "experience": 11,
        "rating": 4.96,
        "jobs": 178,
        "price_min": 120000,
        "price_max": 500000,
        "about": "Samsung, LG, Artel, Bosch kir yuvish mashinalari va muzlatgichlarni original ehtiyot qismlar bilan kafolatli tuzatish. Joyiga borib tezkor diagnostika.",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    },
    {
        "phone": "+998901112205",
        "name": "Farxod Temirov",
        "title": "Kafelchi va ichki pardozlash ustasi",
        "short_title": "Pardozlash ustasi",
        "category_slug": "pardozlash",
        "city": "Farg‘ona viloyati",
        "district_slug": "fargona-viloyati-fargona-shahri",
        "district_text": "Farg‘ona shahri",
        "experience": 12,
        "rating": 4.90,
        "jobs": 86,
        "price_min": 70000,
        "price_max": 300000,
        "about": "Kafel, laminat, gipsokarton va shpatlyovka ishlari. Lazer bilan aniq o‘lchab sifatli bajaraman.",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    },
    {
        "phone": "+998901112206",
        "name": "Jasur Qodirov",
        "title": "Mebel konstruktori va yig‘uvchi",
        "short_title": "Mebel ustasi",
        "category_slug": "mebel",
        "city": "Andijon viloyati",
        "district_slug": "andijon-viloyati-andijon-shahri",
        "district_text": "Andijon shahri",
        "experience": 6,
        "rating": 4.85,
        "jobs": 62,
        "price_min": 80000,
        "price_max": 350000,
        "about": "Oshxona garnituri, shkaflar, krovat va ofis mebellarini professional yig‘ish va sozlash.",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    },
    {
        "phone": "+998901112207",
        "name": "Dilnoza Karimova",
        "title": "Xonadon va ofis klining mutaxassisi",
        "short_title": "Klining ustasi",
        "category_slug": "tozalash",
        "city": "Toshkent shahri",
        "district_slug": "toshkent-shahri-yakkasaroy",
        "district_text": "Yakkasaroy tumani",
        "experience": 5,
        "rating": 4.98,
        "jobs": 140,
        "price_min": 150000,
        "price_max": 600000,
        "about": "Mukammal tozalik, professional karcher apparatlari, xavfsiz va sertifikatlangan tozalash vositalari.",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    },
    {
        "phone": "+998901112208",
        "name": "Shavkat Ergashev",
        "title": "Shoshilinch qulf ochish xizmati ustasi",
        "short_title": "Qulf ustasi",
        "category_slug": "qulf-ochish",
        "city": "Toshkent shahri",
        "district_slug": "toshkent-shahri-mirzo-ulug-bek",
        "district_text": "Mirzo Ulug‘bek tumani",
        "experience": 14,
        "rating": 4.97,
        "jobs": 210,
        "price_min": 120000,
        "price_max": 350000,
        "about": "24/7 tezkor xizmat. Eshik va avtomobillarni zararsiz ochish, yangi xavfsiz qulflar o‘rnatish.",
        "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    },
]

class Command(BaseCommand):
    help = "Seeds real marketplace services and regional active providers"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("Populating marketplace services...")
        total_services = 0

        for cat_slug, services_list in MARKETPLACE_SERVICES.items():
            category = ServiceCategory.objects.filter(slug=cat_slug).first()
            if not category:
                continue
            for s_name, s_slug, s_price, s_desc in services_list:
                Service.objects.get_or_create(
                    category=category,
                    slug=s_slug,
                    defaults={
                        "name": s_name,
                        "base_price": s_price,
                        "description": s_desc,
                        "is_active": True,
                    }
                )
                total_services += 1

        self.stdout.write(f"Seeded {total_services} specific catalog services.")

        self.stdout.write("Seeding regional verified providers...")
        total_providers = 0

        for p_data in SEED_PROVIDERS:
            user, _ = User.objects.get_or_create(
                phone=p_data["phone"],
                defaults={
                    "first_name": p_data["name"].split()[0],
                    "last_name": p_data["name"].split()[-1] if len(p_data["name"].split()) > 1 else "",
                    "role": User.Role.PROVIDER,
                    "avatar": p_data["avatar"],
                    "is_active": True,
                    "is_verified": True,
                }
            )
            user.set_password("password123")
            user.save()

            region = Region.objects.filter(name__icontains=p_data["city"].split()[0]).first()
            district = District.objects.filter(slug=p_data["district_slug"]).first()
            if not district and region:
                district = region.districts.first()

            category = ServiceCategory.objects.filter(slug=p_data["category_slug"]).first()

            provider, _ = ProviderProfile.objects.get_or_create(
                user=user,
                defaults={
                    "slug": f"usta-{p_data['phone'].replace('+', '')[-6:]}",
                    "display_name": p_data["name"],
                    "title": p_data["title"],
                    "short_title": p_data["short_title"],
                    "about_text": p_data["about"],
                    "experience_years": p_data["experience"],
                    "rating_avg": p_data["rating"],
                    "review_count": p_data["jobs"] // 3,
                    "completed_jobs": p_data["jobs"],
                    "price_min": p_data["price_min"],
                    "price_max": p_data["price_max"],
                    "region": region,
                    "district": district,
                    "city": p_data["city"],
                    "district_text": p_data["district_text"],
                    "address_full": f"{p_data['city']}, {p_data['district_text']}",
                    "is_online": True,
                    "verification_status": ProviderProfile.VerificationStatus.VERIFIED,
                    "status": ProviderProfile.Status.ACTIVE,
                    "available_time": "Bugun 18:00 dan bo‘sh",
                }
            )

            # Link category services
            if category:
                for service in category.services.all()[:3]:
                    ProviderService.objects.get_or_create(
                        provider=provider,
                        service=service,
                        defaults={
                            "custom_name": service.name,
                            "description": service.description,
                            "price": service.base_price,
                            "is_active": True,
                        }
                    )

            # Sample portfolio item
            ProviderPortfolio.objects.get_or_create(
                provider=provider,
                title=f"{p_data['short_title']} bo‘yicha bajarilgan sifatli ish",
                defaults={
                    "location": p_data["district_text"],
                    "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&fit=crop",
                }
            )
            total_providers += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {total_providers} regional active providers!"))
