from django.core.management.base import BaseCommand
from django.db import transaction
from apps.users.models import User
from apps.locations.models import Region, District, Address
from apps.catalog.models import ServiceCategory, Service
from apps.providers.models import ProviderProfile, ProviderService, ProviderPortfolio
from apps.service_requests.models import ServiceRequest
from apps.quotes.models import Quote
from apps.bookings.models import Booking, BookingTimelineStep
from apps.conversations.models import Conversation, ConversationParticipant, Message
from apps.reviews.models import Review
from apps.verification.models import ProviderVerification
from apps.promotions.models import Promotion
from apps.matching.services.matcher import match_providers_for_request

class Command(BaseCommand):
    help = "Usta Top demo ma'lumotlarini bazaga yuklaydi"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("Demo ma'lumotlar yuklanmoqda...")

        # 1. Users
        customer_user, _ = User.objects.get_or_create(
            phone="+998901234567",
            defaults={
                "first_name": "Sardor",
                "last_name": "Alimov",
                "role": User.Role.CUSTOMER,
                "avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuAxqK9Q4oJ99lTd1fIgwrsM-zNV27iuvEpwMt5OXK3dQV0DqJ-ON2aEiCDxIK72Qiz8Zt81xHO1ak1XJJcQXT14yULKhuTR6BsXmgdThDDyHqGDtgDpjmVhvR6-zZGw9Qcj8TcmXdj6c4kKD3H4eikIseUGh_MjxFhL3hu54av5aLhfNtgzx7ijl76uAOflwlMdlFgNTBA4oFeYBmUr6F5Rn4l-R1Op_pWt6gKMv8DBlm2xGd3xlIv11g",
                "is_verified": True,
            },
        )
        customer_user.set_password("password123")
        customer_user.save()

        provider_user, _ = User.objects.get_or_create(
            phone="+998909876543",
            defaults={
                "first_name": "Ali",
                "last_name": "Karimov",
                "role": User.Role.PROVIDER,
                "avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuDEO8_6X8DRH3xqwrD2kgZ85JlrP3AQ8150pmUGfRFpA85-WD6tL7Gk0lDa4E_I3MJOpBNkh5vdZhKrd41_XgH_xB2TIPgdWySzbjVWEJQxWFtrXChbM8JE7CuH2j3SOX_8KQchAZkJvLrLxYVSfxXzFFpiCg7wUWjZUxV-eCeCAlZOctBffFZmGIJAQZ2gHa_LdeRbRAMfBqettSQFbvjgLwhRCdw64S0XH6oanNdKJbUODaRXrTjv6w",
                "is_verified": True,
            },
        )
        provider_user.set_password("password123")
        provider_user.save()

        admin_user, _ = User.objects.get_or_create(
            phone="+998990000000",
            defaults={
                "first_name": "Usta Top",
                "last_name": "Admin",
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "is_verified": True,
            },
        )
        admin_user.set_password("admin123")
        admin_user.save()

        # 2. Locations
        region, _ = Region.objects.get_or_create(name="Toshkent shahri", defaults={"slug": "toshkent"})
        districts_data = ["Chilonzor", "Yunusobod", "Mirzo Ulug‘bek", "Yakkasaroy", "Shayxontohur", "Olmazor", "Uchtepa", "Yashnobod", "Sergeli"]
        districts_map = {}
        for d_name in districts_data:
            slug = d_name.lower().replace("‘", "").replace(" ", "-")
            dist, _ = District.objects.get_or_create(region=region, name=d_name, defaults={"slug": slug})
            districts_map[d_name] = dist

        # Customer Address
        Address.objects.get_or_create(
            user=customer_user,
            district=districts_map["Chilonzor"],
            region=region,
            defaults={
                "address_text": "Toshkent sh., Chilonzor tumani, 9-mavze, 14-uy, 28-xonadon",
                "latitude": 41.285600,
                "longitude": 69.203400,
                "is_default": True,
            }
        )

        # 3. Categories & Services
        cat_data = [
            ("santexnika", "Santexnika", "Kranlar, quvurlar, vanna va unitaz o‘rnatish", "Wrench", 420, True),
            ("elektrik", "Elektrik", "Simlar almashtirish, lyustra, avtomat va rozetkalar", "Zap", 380, True),
            ("konditsioner", "Konditsioner", "Freon quyish, yuvish, montaj va ta'mirlash", "Snowflake", 290, True),
            ("maishiy-texnika", "Maishiy texnika", "Kir yuvish mashinasi, muzlatgich, gaz plitalari", "Tv", 510, True),
            ("mebel", "Mebel yig‘ish", "Shkaf, oshxona mebellari yig‘ish va ta'mirlash", "Hammer", 180, False),
            ("qulf-ochish", "Qulf ochish", "Eshik qulflarini shikastlamasdan ochish va almashtirish", "Key", 95, False),
            ("tozalash", "Tozalash / Klining", "Xonadon, ofis va derazalarni professional tozalash", "Sparkles", 210, False),
            ("pardozlash", "Pardozlash", "Malyar, oboy yopishtirish, gipsokarton va laminat", "Paintbrush", 340, False),
        ]

        categories_map = {}
        for slug, name, desc, icon, count, feat in cat_data:
            cat, _ = ServiceCategory.objects.get_or_create(
                slug=slug,
                defaults={
                    "name": name,
                    "description": desc,
                    "icon": icon,
                    "masters_count": count,
                    "featured": feat,
                }
            )
            categories_map[slug] = cat

        # Services
        konditsioner_cat = categories_map["konditsioner"]
        serv1, _ = Service.objects.get_or_create(category=konditsioner_cat, slug="tozalash-yuvish", defaults={"name": "Konditsionerni yuvish va profilaktika", "base_price": 120000})
        serv2, _ = Service.objects.get_or_create(category=konditsioner_cat, slug="freon-quyish", defaults={"name": "Freon to‘ldirish (R410A / R22)", "base_price": 180000})
        serv3, _ = Service.objects.get_or_create(category=konditsioner_cat, slug="kompressor-tamiri", defaults={"name": "Kompressor va elektron plata ta'miri", "base_price": 250000})

        # 4. Providers
        ali_provider, _ = ProviderProfile.objects.get_or_create(
            user=provider_user,
            defaults={
                "slug": "ali-karimov",
                "display_name": "Ali Karimov (Ali Usta)",
                "title": "Konditsioner va iqlim tizimlari bo‘yicha bosh usta",
                "short_title": "Konditsioner ustasi",
                "cover_image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAw6u9q7Yv_N5oV26s93fM_w9h4Vv9w3c-g4Q8jXbFp1024",
                "about_text": "8 yillik tajribaga ega sertifikatlangan HVAC mutaxassisiman. Artel, Shivaki, Midea, Gree, Carrier va barcha turdagi split tizimlarni sifatli ta'mirlayman. Ishimga 12 oygacha rasmiy kafolat beraman.",
                "experience_years": 8,
                "rating_avg": 4.90,
                "review_count": 94,
                "completed_jobs": 127,
                "response_minutes": 15,
                "verification_status": ProviderProfile.VerificationStatus.VERIFIED,
                "status": ProviderProfile.Status.ACTIVE,
                "district": districts_map["Chilonzor"],
                "district_text": "Chilonzor",
                "city": "Toshkent",
                "address_full": "Chilonzor tumani, 9-mavze",
                "price_min": 120000,
                "price_max": 350000,
                "available_time": "Bugun 17:00 dan boshlab bo‘sh",
                "is_online": True,
                "warranty_months": 12,
                "vehicle_model": "Cobalt oq",
                "vehicle_plate": "01 A 777 BA",
            }
        )

        ProviderService.objects.get_or_create(provider=ali_provider, custom_name="Konditsioner tozalash va antibakterial yuvish", defaults={"price": 120000, "badge": "Ommabop", "service": serv1})
        ProviderService.objects.get_or_create(provider=ali_provider, custom_name="Freon to‘ldirish (R410A / R22 / R32)", defaults={"price": 180000, "badge": "Kafolatli", "service": serv2})
        ProviderService.objects.get_or_create(provider=ali_provider, custom_name="Elektron plata va kompressor diagnostikasi", defaults={"price": 230000, "service": serv3})

        portfolio_samples = [
            ("Artel Inverter konditsionerini to‘liq tozalash", "Chilonzor-9", "https://lh3.googleusercontent.com/aida-public/AB6AXuAw6u9q7Yv_N5oV26s93fM_w9h4Vv9w3c-g4Q8jXbFp1024"),
            ("Carrier split tizimini o‘rnatish va trassa tortish", "Yunusobod-4", "https://lh3.googleusercontent.com/aida-public/AB6AXuAw6u9q7Yv_N5oV26s93fM_w9h4Vv9w3c-g4Q8jXbFp1024"),
            ("Freon sizib chiqishini aniqlash va payvandlash", "Mirzo Ulug‘bek", "https://lh3.googleusercontent.com/aida-public/AB6AXuAw6u9q7Yv_N5oV26s93fM_w9h4Vv9w3c-g4Q8jXbFp1024"),
        ]
        for title, loc, img in portfolio_samples:
            ProviderPortfolio.objects.get_or_create(provider=ali_provider, title=title, defaults={"location": loc, "image_url": img})

        # 5. Service Request #UT-8942
        req, _ = ServiceRequest.objects.get_or_create(
            code="UT-8942",
            defaults={
                "customer": customer_user,
                "category": konditsioner_cat,
                "service": serv2,
                "title": "Konditsioner sovuq bermayapti (Freon oqishi)",
                "problem_description": "Artel invertor konditsioneri yoqilganda faqat oddiy shamol haydamoqda, sovuq havo bermayapti. Kompressordan ozgina qisirlagan ovoz kelyapti.",
                "detected_issues": [
                    "Xladagent (freon) kamaygan yoki sizib chiqqan",
                    "Kompressor bosimi yetarli emas",
                    "Filtrlar chang bilan to‘lgan bo‘lishi mumkin",
                ],
                "answers": {
                    "brand": "Artel Inverter 12",
                    "timeframe": "Bugun kechki payt",
                    "condition": "Faqat iliq havo puflayapti",
                },
                "city": "Toshkent",
                "district": "Chilonzor",
                "address_text": "Chilonzor tumani, 9-mavze, 14-uy",
                "latitude": 41.285600,
                "longitude": 69.203400,
                "urgency": ServiceRequest.Urgency.URGENT,
                "urgency_text": "⚡ Shoshilinch",
                "status": ServiceRequest.Status.ASSIGNED,
            }
        )

        # 6. Quotes
        quote_ali, _ = Quote.objects.get_or_create(
            request=req,
            provider=ali_provider,
            defaults={
                "labor_amount": 150000,
                "parts_amount": 80000,
                "additional_amount": 0,
                "total_amount": 230000,
                "arrival_time": "Bugun, 17:30 – 18:00 oralig‘ida",
                "warranty": "12 oy to‘liq kafolat",
                "notes": "Freon to‘ldirish va trassa germetikligini tekshirish narx ichida. Karcher bilan filtrlar ham yuviladi.",
                "status": Quote.Status.ACCEPTED,
            }
        )

        # 7. Booking
        booking, _ = Booking.objects.get_or_create(
            order_number="#UT-8942",
            defaults={
                "request": req,
                "quote": quote_ali,
                "customer": customer_user,
                "provider": ali_provider,
                "service_name": "Konditsioner ta'miri va freon to‘ldirish",
                "total_price": 230000,
                "status": Booking.Status.IN_TRANSIT,
                "status_text": "Usta yo‘lda",
                "scheduled_time": "Bugun, 17:30 – 19:30",
                "estimated_arrival": "17:50",
                "estimated_minutes_left": 10,
                "vehicle_model": "Cobalt oq",
                "vehicle_color": "Oq",
                "vehicle_plate": "01 A 777 BA",
                "destination_address": "Chilonzor tumani, 9-mavze, 14-uy",
                "distance_km": 3.2,
                "payment_method": Booking.PaymentMethod.ESCROW,
                "is_paid": True,
            }
        )

        steps = [
            ("Buyurtma tasdiqlandi", "Taklif qabul qilindi", "15:35", True, False, 1),
            ("Usta yo‘lga chiqdi", "Cobalt oq 01 A 777 BA", "17:25", True, False, 2),
            ("Usta yo‘lda", "Taxminan 10 daqiqa qoldi", "Hozir", False, True, 3),
            ("Yetib kelish", "Chilonzor-9, 14-uy manzili", "17:50", False, False, 4),
            ("Ish bajarilishi", "Nosozlik bartaraf etiladi", "18:00", False, False, 5),
        ]
        for title, sub, ts, comp, curr, ord_num in steps:
            BookingTimelineStep.objects.get_or_create(
                booking=booking,
                order=ord_num,
                defaults={"title": title, "subtitle": sub, "timestamp_text": ts, "completed": comp, "current": curr}
            )

        # 8. Conversation & Messages
        conv, _ = Conversation.objects.get_or_create(request=req, booking=booking)
        ConversationParticipant.objects.get_or_create(conversation=conv, user=customer_user)
        ConversationParticipant.objects.get_or_create(conversation=conv, user=provider_user)

        messages_data = [
            (customer_user, "Assalomu alaykum Ali aka, buyurtmani qabul qilganingiz uchun rahmat. Konditsioner 9-mavzeda joylashgan."),
            (provider_user, "Va alaykum assalom! Freon balloni va karcher uskunasini olib yo‘lga chiqdim. Taxminan 17:50 da manzildaman."),
            (customer_user, "Yaxshi, 2-podyezd, 28-xonadon. Domofon kodi 45K."),
            (provider_user, "Tushunarli, 10 daqiqada yetib boraman. Mashina: Cobalt oq 01 A 777 BA."),
        ]
        for sender, txt in messages_data:
            Message.objects.get_or_create(conversation=conv, sender=sender, text=txt)

        # 9. Review
        past_booking, _ = Booking.objects.get_or_create(
            order_number="#UT-8920",
            defaults={
                "request": req,
                "customer": customer_user,
                "provider": ali_provider,
                "service_name": "Konditsionerni mavsumiy tozalash",
                "total_price": 180000,
                "status": Booking.Status.COMPLETED,
                "status_text": "Bajarildi",
                "is_paid": True,
            }
        )
        Review.objects.get_or_create(
            booking=past_booking,
            customer=customer_user,
            provider=ali_provider,
            defaults={
                "rating": 5,
                "quality_rating": 5.0,
                "punctuality_rating": 4.9,
                "price_rating": 4.9,
                "service_title": "Konditsioner yuvish",
                "location_text": "Chilonzor",
                "comment": "Ali usta aytilgan vaqtda aniq yetib keldi. Konditsionerni yechmasdan maxsus chexol bilan toza yuvib berdi, hamma joy saranjom qoldi. Rahmat!",
            }
        )

        # 10. Verification
        ProviderVerification.objects.get_or_create(
            provider=ali_provider,
            defaults={
                "category_name": "Konditsioner",
                "passport_serial": "AA 1234567",
                "passport_photo_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDEO8_6X8DRH3xqwrD2kgZ85JlrP3AQ8150pmUGfRFpA85-WD6tL7Gk0lDa4E_I3MJOpBNkh5vdZhKrd41_XgH_xB2TIPgdWySzbjVWEJQxWFtrXChbM8JE7CuH2j3SOX_8KQchAZkJvLrLxYVSfxXzFFpiCg7wUWjZUxV-eCeCAlZOctBffFZmGIJAQZ2gHa_LdeRbRAMfBqettSQFbvjgLwhRCdw64S0XH6oanNdKJbUODaRXrTjv6w",
                "face_photo_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDEO8_6X8DRH3xqwrD2kgZ85JlrP3AQ8150pmUGfRFpA85-WD6tL7Gk0lDa4E_I3MJOpBNkh5vdZhKrd41_XgH_xB2TIPgdWySzbjVWEJQxWFtrXChbM8JE7CuH2j3SOX_8KQchAZkJvLrLxYVSfxXzFFpiCg7wUWjZUxV-eCeCAlZOctBffFZmGIJAQZ2gHa_LdeRbRAMfBqettSQFbvjgLwhRCdw64S0XH6oanNdKJbUODaRXrTjv6w",
                "certificates": ["Carrier HVAC Sertifikati 2021", "Artel Malaka oshirish"],
                "status": ProviderVerification.Status.APPROVED,
            }
        )

        # 11. Promotions
        Promotion.objects.get_or_create(
            code="YANGIUSTA",
            defaults={
                "description": "Yangi foydalanuvchilar uchun 15% chegirma",
                "discount_type": Promotion.DiscountType.PERCENTAGE,
                "value": 15,
                "max_discount": 50000,
                "min_order_amount": 100000,
            }
        )
        Promotion.objects.get_or_create(
            code="BAHOR2026",
            defaults={
                "description": "Bahor mavsumi uchun 25 000 so‘m chegirma",
                "discount_type": Promotion.DiscountType.FIXED,
                "value": 25000,
                "min_order_amount": 150000,
            }
        )

        # 12. Run matcher for #UT-8942
        match_providers_for_request(req)

        self.stdout.write(self.style.SUCCESS("Barcha demo ma'lumotlar muvaffaqiyatli yuklandi!"))
