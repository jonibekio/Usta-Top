import datetime
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.users.models import User
from apps.providers.models import (
    ProviderProfile,
    ProviderService,
    ProviderPortfolio,
)
from apps.catalog.models import ServiceCategory
from apps.locations.models import Region, District, Address
from apps.bookings.models import Booking, BookingTimelineStep
from apps.conversations.models import Conversation, ConversationParticipant, Message
from apps.notifications.models import Notification
from apps.favorites.models import FavoriteProvider
from apps.reviews.models import Review

class Command(BaseCommand):
    help = "Seed demo customer and provider accounts with full flow (bookings, chats, notifications, addresses, favorites)"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("Seeding demo accounts and flow...")

        # 1. Customer User: Sardor Alimov
        customer, _ = User.objects.get_or_create(
            phone="+998901234567",
            defaults={
                "first_name": "Sardor",
                "last_name": "Alimov",
                "role": User.Role.CUSTOMER,
                "is_active": True,
                "is_verified": True,
                "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
            },
        )
        customer.first_name = "Sardor"
        customer.last_name = "Alimov"
        customer.role = User.Role.CUSTOMER
        customer.is_active = True
        customer.is_verified = True
        customer.avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
        customer.set_password("pass1234")
        customer.save()

        # 2. Provider User: Ali Karimov
        provider_user, _ = User.objects.get_or_create(
            phone="+998909876543",
            defaults={
                "first_name": "Ali",
                "last_name": "Karimov",
                "role": User.Role.PROVIDER,
                "is_active": True,
                "is_verified": True,
                "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80",
            },
        )
        provider_user.first_name = "Ali"
        provider_user.last_name = "Karimov"
        provider_user.role = User.Role.PROVIDER
        provider_user.is_active = True
        provider_user.is_verified = True
        provider_user.avatar = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"
        provider_user.set_password("pass1234")
        provider_user.save()

        # Ensure regions & category
        toshkent_region, _ = Region.objects.get_or_create(name="Toshkent shahri", defaults={"slug": "toshkent-shahri"})
        chilonzor_district, _ = District.objects.get_or_create(region=toshkent_region, name="Chilonzor tumani", defaults={"slug": "chilonzor-tumani"})
        yunusobod_district, _ = District.objects.get_or_create(region=toshkent_region, name="Yunusobod tumani", defaults={"slug": "yunusobod-tumani"})
        ac_category, _ = ServiceCategory.objects.get_or_create(slug="konditsioner", defaults={"name": "Konditsionerlar", "order": 3})

        # Provider Profile
        provider_profile, _ = ProviderProfile.objects.get_or_create(
            user=provider_user,
            defaults={
                "slug": "ali-karimov-konditsioner",
                "display_name": "Ali Karimov",
                "title": "Konditsioner va iqlim tizimlari ustasi",
                "short_title": "Konditsioner ustasi",
                "city": "Toshkent",
                "district_text": "Chilonzor tumani",
                "address_text": "Chilonzor tumani, Bunyodkor shoh ko‘chasi",
                "region": toshkent_region,
                "district": chilonzor_district,
                "experience_years": 7,
                "rating_avg": 4.9,
                "reviews_count": 38,
                "completed_jobs": 142,
                "status": ProviderProfile.Status.ACTIVE,
                "verification_status": ProviderProfile.VerificationStatus.VERIFIED,
                "price_min": 100000,
                "price_max": 500000,
                "response_time_minutes": 15,
                "warranty_months": 6,
                "is_online": True,
                "vehicle_model": "Cobalt",
                "vehicle_plate": "01 A 777 BA",
                "about_text": "7 yillik tajribaga ega malakali mutaxassis. Har qanday rusumdagi konditsionerlarni professional darajada o‘rnatish, tozalash, freon quyish va ta’mirlash xizmatlari. Bajarilgan har bir ishga rasmiy kafolat beraman.",
            },
        )
        provider_profile.display_name = "Ali Karimov"
        provider_profile.title = "Konditsioner va iqlim tizimlari ustasi"
        provider_profile.short_title = "Konditsioner ustasi"
        provider_profile.experience_years = 7
        provider_profile.rating_avg = 4.9
        provider_profile.completed_jobs = 142
        provider_profile.vehicle_model = "Cobalt"
        provider_profile.vehicle_plate = "01 A 777 BA"
        provider_profile.verification_status = ProviderProfile.VerificationStatus.VERIFIED
        provider_profile.status = ProviderProfile.Status.ACTIVE
        provider_profile.save()

        # Provider Services
        ac_service = ac_category.services.first()
        services_data = [
            ("Konditsionerni tozalash va yuvish", 150000, "Ichki va tashqi bloklarni maxsus kimyoviy vosita bilan yuvish"),
            ("Freon (gaz) quyish R410/R22", 220000, "Bosimni tekshirish, sizib chiqish joylarini aniqlash va sifatli freon quyish"),
            ("Konditsioner montaj va demontaj", 350000, "Standart trassa bilan sifatli o‘rnatish va vakuumlash"),
            ("Kompressor va elektronika diagnostikasi", 100000, "Elektr tizimi, sensorlar va kompressorni tekshirish"),
        ]
        for name, price, desc in services_data:
            ProviderService.objects.get_or_create(
                provider=provider_profile,
                custom_name=name,
                defaults={"service": ac_service, "price": price, "description": desc, "is_active": True},
            )

        # Provider Portfolio
        portfolio_images = [
            ("Midea invertor konditsioneri o‘rnatildi", "Toshkent, Chilonzor", "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=500&q=80"),
            ("Tashqi blok montaji va vakuumlash", "Toshkent, Yunusobod", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80"),
        ]
        for title, loc, url in portfolio_images:
            ProviderPortfolio.objects.get_or_create(
                provider=provider_profile,
                title=title,
                defaults={"location": loc, "image_url": url},
            )

        # 3. Customer Saved Addresses
        Address.objects.filter(user=customer).delete()
        Address.objects.create(
            user=customer,
            region=toshkent_region,
            district=chilonzor_district,
            address_text="Toshkent shahri, Chilonzor tumani, 9-mavze, 14-uy, 25-xonadon",
            landmark="Korzinka supermarketining yonida",
            is_default=True,
        )
        Address.objects.create(
            user=customer,
            region=toshkent_region,
            district=yunusobod_district,
            address_text="Toshkent shahri, Yunusobod tumani, 4-mavze, 8-uy",
            landmark="Megaplanet savdo majmuasi orqasida",
            is_default=False,
        )

        # 4. Favorites for Sardor
        FavoriteProvider.objects.get_or_create(customer=customer, provider=provider_profile)

        other_provider = ProviderProfile.objects.exclude(id=provider_profile.id).first()
        if other_provider:
            FavoriteProvider.objects.get_or_create(customer=customer, provider=other_provider)

        # 5. Bookings (4 realistic bookings in different states)
        Booking.objects.filter(customer=customer).delete()

        # Booking 1: IN_PROGRESS (Faol ish)
        b1 = Booking.objects.create(
            order_number="UT-48201",
            customer=customer,
            provider=provider_profile,
            service_name="Konditsionerni tozalash va freon quyish",
            total_price=370000,
            status=Booking.Status.IN_PROGRESS,
            status_text="Ish bajarilmoqda",
            scheduled_time="Bugun, 15:00 – 18:00",
            destination_address="Toshkent shahri, Chilonzor tumani, 9-mavze, 14-uy",
            problem_description="Konditsioner yetarli darajada sovuq bermayapti va ichki blokdan ozgina suv tomchilamoqda.",
            vehicle_model="Cobalt",
            vehicle_plate="01 A 777 BA",
            payment_method=Booking.PaymentMethod.CASH,
            is_paid=False,
        )
        steps_b1 = [
            ("Buyurtma yuborildi", "Mijoz tomonidan buyurtma rasmiylashtirildi", "14:15", True, False, 1),
            ("Usta tasdiqladi", "Usta buyurtmani qabul qildi", "14:22", True, False, 2),
            ("Yo‘lga chiqdi", "Cobalt 01 A 777 BA manzil tomon yo‘lda", "14:50", True, False, 3),
            ("Ish jarayoni", "Usta yetib kelib ishni bajarishga kirishdi", "15:10", False, True, 4),
            ("Yakunlash & To‘lov", "Xizmat yakunlanishi va baholash", "--:--", False, False, 5),
        ]
        for t, s, ts, comp, curr, ord_num in steps_b1:
            BookingTimelineStep.objects.create(booking=b1, title=t, subtitle=s, timestamp_text=ts, completed=comp, current=curr, order=ord_num)

        # Booking 2: CREATED (Yangi kelgan - waiting for provider to accept on jobs page)
        b2 = Booking.objects.create(
            order_number="UT-79104",
            customer=customer,
            provider=provider_profile,
            service_name="Freon (gaz) quyish R410",
            total_price=220000,
            status=Booking.Status.CREATED,
            status_text="Yangi buyurtma (Usta tasdiqlashi kutilmoqda)",
            scheduled_time="Ertaga, 10:00 – 13:00",
            destination_address="Toshkent shahri, Yunusobod tumani, 4-mavze, 8-uy",
            problem_description="Yangi mavsum oldidan freon bosimini o‘lchab to‘ldirish kerak.",
            vehicle_model="Cobalt",
            vehicle_plate="01 A 777 BA",
            payment_method=Booking.PaymentMethod.CASH,
            is_paid=False,
        )
        steps_b2 = [
            ("Buyurtma yuborildi", "Mijoz tomonidan buyurtma rasmiylashtirildi", "Bugun", True, False, 1),
            ("Usta tasdiqlashi", "Usta buyurtmani ko‘rib chiqmoqda", "Kutilmoqda", False, True, 2),
            ("Yo‘lga chiqish", "Belgilangan vaqtda usta yo‘lga chiqadi", "--:--", False, False, 3),
            ("Ish jarayoni", "Xizmat ko‘rsatilmoqda", "--:--", False, False, 4),
            ("Yakunlash & Baholash", "Xizmat yakunlanadi", "--:--", False, False, 5),
        ]
        for t, s, ts, comp, curr, ord_num in steps_b2:
            BookingTimelineStep.objects.create(booking=b2, title=t, subtitle=s, timestamp_text=ts, completed=comp, current=curr, order=ord_num)

        # Booking 3: COMPLETED (Yakunlangan - user can leave review)
        b3 = Booking.objects.create(
            order_number="UT-32910",
            customer=customer,
            provider=provider_profile,
            service_name="Konditsioner montaj va demontaj",
            total_price=350000,
            status=Booking.Status.COMPLETED,
            status_text="Ish yakunlandi",
            scheduled_time="2 kun oldin",
            destination_address="Toshkent shahri, Chilonzor tumani, 9-mavze, 14-uy",
            problem_description="Eski konditsionerni yechib, yangi Midea modelini o‘rnatish kerak edi.",
            vehicle_model="Cobalt",
            vehicle_plate="01 A 777 BA",
            payment_method=Booking.PaymentMethod.CASH,
            is_paid=True,
        )
        steps_b3 = [
            ("Buyurtma yuborildi", "Mijoz tomonidan yuborilgan", "2 kun oldin", True, False, 1),
            ("Usta tasdiqladi", "Usta buyurtmani qabul qildi", "2 kun oldin", True, False, 2),
            ("Yo‘lga chiqdi", "Usta yetib keldi", "2 kun oldin", True, False, 3),
            ("Ish bajarildi", "Montaj to‘liq amalga oshirildi", "2 kun oldin", True, False, 4),
            ("Yakunlandi", "Mijoz ishni qabul qilib to‘lovni amalga oshirdi", "2 kun oldin", True, False, 5),
        ]
        for t, s, ts, comp, curr, ord_num in steps_b3:
            BookingTimelineStep.objects.create(booking=b3, title=t, subtitle=s, timestamp_text=ts, completed=comp, current=curr, order=ord_num)

        # 6. Chat Conversation between Sardor and Ali
        Conversation.objects.filter(participants__user=customer).delete()
        conv = Conversation.objects.create(booking=b1)
        ConversationParticipant.objects.create(conversation=conv, user=customer)
        ConversationParticipant.objects.create(conversation=conv, user=provider_user)

        messages_flow = [
            (customer, "Assalomu alaykum, Ali aka! Konditsionerimiz yaxshi sovutmayapti, bugun ko‘rib bera olasizmi?"),
            (provider_user, "Va alaykum assalom, Sardor aka! Ha, albatta. Soat 15:00 larda Chilonzor tomonlarda bo‘laman, o‘tib ko‘rib beraman."),
            (customer, "Rahmat, kutamiz! Manzilimiz: Chilonzor 9-mavze, 14-uy."),
            (provider_user, "Tushundim, asboblar va freon tayyor. Yo‘lga chiqishim bilan xabar beraman."),
        ]
        for sender, text in messages_flow:
            Message.objects.create(conversation=conv, sender=sender, text=text)

        # 7. Notifications
        Notification.objects.filter(user__in=[customer, provider_user]).delete()
        Notification.objects.create(
            user=customer,
            notification_type=Notification.NotificationType.BOOKING_CONFIRMED,
            title="Buyurtmangiz tasdiqlandi",
            body="Usta Ali Karimov buyurtmangizni qabul qildi. Yetib kelish vaqti: Bugun, 15:00 – 18:00",
            data={"booking_id": str(b1.id), "order_number": b1.order_number},
        )
        Notification.objects.create(
            user=customer,
            notification_type=Notification.NotificationType.BOOKING_STARTED,
            title="Usta yo‘lda",
            body="Ali Karimov oq Cobalt (01 A 777 BA) mashinasida manzilingiz tomon yo‘lga chiqdi.",
            data={"booking_id": str(b1.id), "order_number": b1.order_number},
        )
        Notification.objects.create(
            user=provider_user,
            notification_type=Notification.NotificationType.NEW_REQUEST,
            title="Yangi buyurtma: Freon quyish",
            body="Mijoz Sardor Alimov sizga yangi buyurtma yubordi. Manzil: Yunusobod tumani, 4-mavze, 8-uy",
            data={"booking_id": str(b2.id), "order_number": b2.order_number},
        )

        self.stdout.write(self.style.SUCCESS("Demo accounts and flow seeded successfully!"))
