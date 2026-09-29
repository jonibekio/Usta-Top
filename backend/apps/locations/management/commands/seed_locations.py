from django.core.management.base import BaseCommand
from apps.locations.models import Region, District, Neighborhood

UZBEKISTAN_LOCATIONS = {
    "Toshkent shahri": {
        "slug": "toshkent-shahri",
        "districts": {
            "Yunusobod": ["1-mavze", "2-mavze", "3-mavze", "4-mavze", "Shahriston", "Tiklanish", "Hasanboy"],
            "Chilonzor": ["1-mavze", "2-mavze", "3-mavze", "7-mavze", "9-mavze", "Novza", "Katta Chilonzor", "Qatortol"],
            "Mirzo Ulug‘bek": ["Qorasuv-1", "Qorasuv-2", "Buyuk Ipak Yo‘li", "Feruza", "Olimlar shaharchasi", "Traktorsozlar"],
            "Yakkasaroy": ["Boshliq", "Qushbegi", "Rakat", "Shota Rustaveli", "Konstitutsiya"],
            "Shayxontohur": ["Chorsu", "Jangoh", "Ko‘kcha", "Samarqand Darvoza", "Ibn Sino", "Zangiota ko‘chasi"],
            "Olmazor": ["Qorasaroy", "Sebzor", "Qoraqamish 1/1", "Qoraqamish 2/4", "Chimboy", "G‘alaba"],
            "Uchtepa": ["11-mavze", "12-mavze", "26-mavze", "O‘rikzor", "Farhod bozori atrofi", "Vatan"],
            "Yashnobod": ["Tuzel", "Aviasozlar", "Do‘stlik", "Qo‘yliq-1", "Qo‘yliq-2", "Panjshanba"],
            "Sergeli": ["Sergeli-1", "Sergeli-7", "Qipchoq", "Sputnik", "Quruvchilar", "Yangi Sergeli"],
            "Mirobod": ["Oybek", "Gospital", "Sariko‘l", "Qo‘yliq ota", "Tong"],
            "Bektemir": ["Suvsoz", "Binokor", "Abay", "Husayn Boyqaro"],
            "Yangihayot": ["Yangi Choshtepa", "Yo‘ldosh", "Chortoq", "Humo"],
        },
    },
    "Toshkent viloyati": {
        "slug": "toshkent-viloyati",
        "districts": {
            "Chirchiq shahri": ["1-mikrorayon", "3-mikrorayon", "Troitsk", "Avesto"],
            "Angren shahri": ["Markaz", "Dukent", "Jigariston"],
            "Olmaliq shahri": ["Metallurg", "Kamolot", "Yoshlik"],
            "Yangiyo‘l shahri": ["Gulbahor", "Yangiyo‘l temiryo‘l", "Fayzli"],
            "Bekobod shahri": ["1-daha", "2-daha", "Metallurg"],
            "Nurafshon shahri": ["Navro‘z", "Mustaqillik", "Yoshlar"],
            "Bo‘stonliq tumani": ["G‘azalkent", "Chorvoq", "Chimyon", "Xumson", "Burchmulla"],
            "Qibray tumani": ["Salor", "Dorilfunun", "Baytqo‘rg‘on", "Qibray markaz"],
            "Zangiota tumani": ["Eshonguzar", "Quyosh", "Nazarbek", "Bo‘zsuv"],
            "Toshkent tumani": ["Keles", "Kenes", "Hasanboy chegara", "Sabzavot"],
            "Parkent tumani": ["Parkent shahri", "So‘qoq", "Kumushkon", "Zarkent"],
            "Chinoz tumani": ["Chinoz shahri", "Yangi Chinoz", "Olmazor shaharchasi"],
            "Yangiyo‘l tumani": ["Gulbahor", "Xalqobod", "Sho‘ralisoy"],
            "Piskent tumani": ["Piskent shahri", "Muratali", "Said"],
            "Oqqo‘rg‘on tumani": ["Oqqo‘rg‘on shahri", "Hamzaobod", "Sultonobod"],
            "Bo‘ka tumani": ["Bo‘ka shahri", "Bo‘ston", "Do‘stlik"],
            "Yuqorichirchiq tumani": ["Yangibozor", "Mirobod", "Bordonko‘l"],
            "O‘rtachirchiq tumani": ["To‘ytepa atrofi", "Qorasuv", "Parkentsoy"],
        },
    },
    "Samarqand viloyati": {
        "slug": "samarqand-viloyati",
        "districts": {
            "Samarqand shahri": ["Registon", "Siyob", "Sug‘diyona", "Temiryo‘l vokzali", "Sattepo", "Bag‘dod"],
            "Kattaqo‘rg‘on shahri": ["Markaz", "Zarbdor", "Omonat"],
            "Samarqand tumani": ["Konigil", "Qaynama", "Gulobod"],
            "Pastdarg‘om tumani": ["Juma shahri", "Charxin", "Go‘zalkent"],
            "Urgut tumani": ["Urgut shahri", "Pochvon", "G‘o‘s", "Ispanza"],
            "Bulung‘ur tumani": ["Bulung‘ur shahri", "Kildon", "Fozil Yo‘ldosh"],
            "Jomboy tumani": ["Jomboy shahri", "Dehqonobod", "G‘azira"],
            "Ishtixon tumani": ["Ishtixon shahri", "Mitan", "Shayxlar"],
            "Kattaqo‘rg‘on tumani": ["Payshanba", "Kadan", "Mundiyon"],
            "Narpay tumani": ["Oqtosh shahri", "Mirbozor", "Islom Shoir"],
            "Payariq tumani": ["Payariq shahri", "Chelak shahri", "Birlashgan"],
            "Oqdaryo tumani": ["Loyish", "Dahbed", "Yangiobod"],
            "Toyloq tumani": ["Toyloq markaz", "Bog‘izag‘on", "Vorsin"],
            "Paxtachi tumani": ["Ziyovuddin", "Qarnab", "Sardoba"],
            "Nurobod tumani": ["Nurobod shahri", "Tim", "Sahro"],
            "Qo‘shrabot tumani": ["Qo‘shrabot markaz", "Zarkent", "Jo‘sh"],
        },
    },
    "Buxoro viloyati": {
        "slug": "buxoro-viloyati",
        "districts": {
            "Buxoro shahri": ["Ark atrofi", "Somoniylar", "5-mikrorayon", "G‘ijduvon ko‘chasi", "Mustaqillik"],
            "Kogon shahri": ["Temiryo‘lchilar", "Farhod", "Zirobod"],
            "Buxoro tumani": ["Galaosiyo shahri", "Rabotak", "Bog‘ikalon"],
            "G‘ijduvon tumani": ["G‘ijduvon shahri", "Abadi", "Gagarin", "Soktari"],
            "Jondor tumani": ["Jondor shahri", "Samonchuq", "Po‘lati"],
            "Kogon tumani": ["Sarayon", "Chorbog‘", "Tutkunda"],
            "Qorako‘l tumani": ["Qorako‘l shahri", "Dug‘oba", "Sayyod"],
            "Qorovulbozor tumani": ["Qorovulbozor shahri", "Bo‘zaqir", "Jarqoq"],
            "Peshku tumani": ["Yangibozor", "Peshku markaz", "Ibn Sino"],
            "Romitan tumani": ["Romitan shahri", "Qoqishtuvon", "Xosa"],
            "Shofirkon tumani": ["Shofirkon shahri", "Vang‘ozi", "Jo‘ynav"],
            "Vobkent tumani": ["Vobkent shahri", "Xayrobod", "Pirmast"],
            "Olot tumani": ["Olot shahri", "Chovdur", "Jayxun"],
        },
    },
    "Farg‘ona viloyati": {
        "slug": "fargona-viloyati",
        "districts": {
            "Farg‘ona shahri": ["Kirguli", "Markaz", "Yormozor", "Aeroport", "Oydin"],
            "Marg‘ilon shahri": ["Ipakchilar", "Burhoniddin Marg‘inoniy", "Vokzal", "Yangi Marg‘ilon"],
            "Qo‘qon shahri": ["O‘rda atrofi", "G‘ishtko‘prik", "Davronbek", "Navbahor"],
            "Quvasoy shahri": ["Valik", "Muqimiy", "Do‘stlik"],
            "Oltiariq tumani": ["Oltiariq shahri", "Qopchug‘ay", "Zilxa", "Katput"],
            "Rishton tumani": ["Rishton shahri", "Dudik", "Zohidon", "Avazboy"],
            "Bag‘dod tumani": ["Bag‘dod shahri", "Matqulobod", "Irgali"],
            "Beshariq tumani": ["Beshariq shahri", "Rapqon", "Chimboy"],
            "Buvayda tumani": ["Ibrat", "Buvayda markaz", "Alqor"],
            "Dang‘ara tumani": ["Dang‘ara shahri", "Katta Ganjiravon", "Umar"],
            "Farg‘ona tumani": ["Vodil", "Chimyon", "Novkent"],
            "Qo‘shtepa tumani": ["Langar", "Qumtepa", "Shahartut"],
            "Toshloq tumani": ["Toshloq shahri", "Arabmozor", "Zarkent"],
            "Uchko‘prik tumani": ["Uchko‘prik shahri", "Yakka-tut", "Navro‘z"],
            "O‘zbekiston tumani": ["Yaypan shahri", "Sho‘rsuv", "Qo‘llar"],
            "Yozyovon tumani": ["Yozyovon shahri", "Qorasoqqol", "Markaz"],
            "So‘x tumani": ["Ravon", "Hushyor", "Qal’acha"],
        },
    },
    "Andijon viloyati": {
        "slug": "andijon-viloyati",
        "districts": {
            "Andijon shahri": ["Eski shahar", "Yangi shahar", "Bobur shoh ko‘chasi", "3-mikrorayon", "Kengash"],
            "Xonobod shahri": ["Xonobod markaz", "Fozilmon", "Mehnatobod"],
            "Asaka tumani": ["Asaka shahri", "Kujgan", "Dasturxonchi", "Avtovokzal"],
            "Andijon tumani": ["Kuyganyor", "Zangibobo", "Bo‘taqora"],
            "Baliqchi tumani": ["Baliqchi shahri", "Chinoz", "Xo‘jamehnat"],
            "Bo‘ston tumani": ["Bo‘z shahri", "Xovos", "Mehnat"],
            "Buloqboshi tumani": ["Buloqboshi shahri", "Kulla", "Shirinquduq"],
            "Izboskan tumani": ["Poytug‘ shahri", "To‘rtko‘l", "Qo‘g‘ay"],
            "Jalaquduq tumani": ["Jalaquduq shahri", "Janubiy Olamushuk", "Ko‘kalam"],
            "Marhamat tumani": ["Marhamat shahri", "Polvontosh", "Rovot"],
            "Oltinko‘l tumani": ["Oltinko‘l markaz", "Jalabek", "Xondibog‘i"],
            "Paxtaobod tumani": ["Paxtaobod shahri", "Madaniyat", "Uyg‘ur"],
            "Shahrixon tumani": ["Shahrixon shahri", "Vahim", "Segaza", "Nazarmaxram"],
            "Ulug‘nor tumani": ["Oqoltin", "Yangi hayot", "Bo‘ston"],
            "Xo‘jaobod tumani": ["Xo‘jaobod shahri", "Manak", "Guliston"],
            "Qo‘rg‘ontepa tumani": ["Qo‘rg‘ontepa shahri", "Qorasuv shahri", "Dardoq"],
        },
    },
    "Namangan viloyati": {
        "slug": "namangan-viloyati",
        "districts": {
            "Namangan shahri": ["Chorsu", "Sardoba", "G‘irvon", "Dambog‘", "Lola"],
            "Davlatobod tumani": ["Yuksalish", "Damariq", "Orzu", "Yangi tong"],
            "Yangi Namangan tumani": ["Oromgoh", "Mingchinor", "Bunyodkor"],
            "Chortoq tumani": ["Chortoq shahri", "Hazratishox", "Muchum"],
            "Chust tumani": ["Chust shahri", "G‘ova", "Olmos", "Varzik"],
            "Kosonsoy tumani": ["Kosonsoy shahri", "Terakzor", "Ququmboy"],
            "Mingbuloq tumani": ["Jumasho‘y", "Kugay", "Go‘rtepa"],
            "Namangan tumani": ["Toshbuloq", "Mirishkor", "Qumqo‘rg‘on"],
            "Norin tumani": ["Haqqulobod", "Uchtepa", "Sho‘rariq"],
            "Pop tumani": ["Pop shahri", "Chorkesar", "Uyg‘ursoy"],
            "To‘raqo‘rg‘on tumani": ["To‘raqo‘rg‘on shahri", "Shahand", "Yortepa"],
            "Uychi tumani": ["Uychi shahri", "Fayziobod", "Jiydakapa"],
            "Yangiqo‘rg‘on tumani": ["Yangiqo‘rg‘on shahri", "Nanay", "Zarkent"],
        },
    },
    "Qashqadaryo viloyati": {
        "slug": "qashqadaryo-viloyati",
        "districts": {
            "Qarshi shahri": ["Batosh", "Gungon", "Kaval", "Shohbekat", "Mag‘zon"],
            "Shahrisabz shahri": ["Oqsaroy", "Kushxona", "Ipak yo‘li"],
            "Chiroqchi tumani": ["Chiroqchi shahri", "Langazar", "Uymovut"],
            "Dehqonobod tumani": ["Qorashina", "Dehqonobod markaz", "Beshbuloq"],
            "G‘uzor tumani": ["G‘uzor shahri", "Zarbdor", "Sovuqbuloq"],
            "Kasbi tumani": ["Mug‘lon", "Qasbi markaz", "Maymanoq"],
            "Kitob tumani": ["Kitob shahri", "Tupaxona", "Sevaz"],
            "Koson tumani": ["Koson shahri", "Mudun", "Po‘lati"],
            "Ko‘kdala tumani": ["Yettitom", "Torjilg‘a", "Oltin boshoq"],
            "Mirishkor tumani": ["Yangi Mirishkor", "Jeynov", "Pomuk"],
            "Muborak tumani": ["Muborak shahri", "Qarliq", "Sariq"],
            "Nishon tumani": ["Yangi Nishon", "Nuriston", "Talimarjon"],
            "Qamashi tumani": ["Qamashi shahri", "Badahshon", "Mang‘it"],
            "Qarshi tumani": ["Beshkent", "Charag‘il", "Dasht"],
            "Shahrisabz tumani": ["Miroqi", "Kesh", "Shamaton"],
            "Yakkabog‘ tumani": ["Yakkabog‘ shahri", "Eskibog‘", "Qatag‘on"],
        },
    },
    "Surxondaryo viloyati": {
        "slug": "surxondaryo-viloyati",
        "districts": {
            "Termiz shahri": ["Alpomish", "Bog‘i shamol", "Sanoatchilar", "Guliston"],
            "Angor tumani": ["Angor shahri", "Tallimaron", "Yangiobod"],
            "Bandixon tumani": ["Bandixon shahri", "Qizil bog‘", "Obod"],
            "Boysun tumani": ["Boysun shahri", "Darband", "Sayrob"],
            "Denov tumani": ["Denov shahri", "Hazarbog‘", "Sino", "Yurchi"],
            "Jarqo‘rg‘on tumani": ["Jarqo‘rg‘on shahri", "Minor", "Kakaydi"],
            "Muzrabot tumani": ["Xalqobod", "Muzrabot markaz", "Navbahor"],
            "Oltinsoy tumani": ["Qorliq", "Xayrabod", "Ipoq"],
            "Qiziriq tumani": ["Sariq", "Kunchiqar", "Istiqlol"],
            "Qumqo‘rg‘on tumani": ["Qumqo‘rg‘on shahri", "Arslonboyli", "Jaloir"],
            "Sariosiyo tumani": ["Sariosiyo shahri", "Sharg‘un", "Dashnobod"],
            "Sherobod tumani": ["Sherobod shahri", "Cho‘yinchi", "Zang"],
            "Sho‘rchi tumani": ["Sho‘rchi shahri", "Baxtlitepa", "Yangiariq"],
            "Termiz tumani": ["Uchqizil", "At-Termiziy", "Namuna"],
            "Uzun tumani": ["Uzun shahri", "Jonchekka", "Chinor"],
        },
    },
    "Xorazm viloyati": {
        "slug": "xorazm-viloyati",
        "districts": {
            "Urganch shahri": ["Al-Xorazmiy", "Jaloliddin Manguberdi", "Shovat", "Temiryo‘l"],
            "Xiva shahri": ["Ichan Qal’a", "Dishan Qal’a", "Gandimiyon"],
            "Bog‘ot tumani": ["Bog‘ot shahri", "Beshmirgan", "Dehqonbozor"],
            "Gurlan tumani": ["Gurlan shahri", "Bo‘ldumsaz", "Do‘stlik"],
            "Xonqa tumani": ["Xonqa shahri", "Madir", "Qoraqosh"],
            "Hazorasp tumani": ["Hazorasp shahri", "Pichoqchi", "Ovshar"],
            "Xiva tumani": ["Gullanbog‘", "Sayot", "Qo‘shko‘pir yo‘li"],
            "Qo‘shko‘prik tumani": ["Qo‘shko‘prik shahri", "G‘azavat", "Xonobod"],
            "Shovot tumani": ["Shovot shahri", "Buyrachi", "Katag‘on"],
            "Tuproqqal’a tumani": ["Pitaryak", "Tuproqqal’a markaz", "Sarimoy"],
            "Urganch tumani": ["Qorovul", "Chondirqiyot", "Yuqori bog‘"],
            "Yangiariq tumani": ["Yangiariq shahri", "Ostona", "Chigirchi"],
            "Yangibozor tumani": ["Yangibozor shahri", "Qalandarxona", "Bo‘zqal’a"],
        },
    },
    "Navoiy viloyati": {
        "slug": "navoiy-viloyati",
        "districts": {
            "Navoiy shahri": ["Tinchlik", "Vatan", "Zarafshon ko‘chasi", "Yoshlik", "Guliston"],
            "Zarafshon shahri": ["Oltin vodiy", "Konchilar", "Bahar"],
            "Karmana tumani": ["Karmana markaz", "Varq", "Malikrabot"],
            "Qiziltepa tumani": ["Qiziltepa shahri", "Vang‘ozi", "Zarmetan"],
            "Konimex tumani": ["Konimex shahri", "Uchtepa", "Sarjal"],
            "Xatirchi tumani": ["Aqcha", "Langar", "Polvon"],
            "Navbahor tumani": ["Beshrabot", "Keskanterak", "Qalaimir"],
            "Nurota tumani": ["Nurota shahri", "Chashma", "Sentob"],
            "Tomdi tumani": ["Tomdibuloq", "Aqtov", "Suketti"],
            "Uchquduq tumani": ["Uchquduq shahri", "Shalxar", "Navro‘z"],
        },
    },
    "Jizzax viloyati": {
        "slug": "jizzax-viloyati",
        "districts": {
            "Jizzax shahri": ["Sayiljoyi", "Oltin vodiy", "Zilol", "Qipchoq", "Toshloq"],
            "Sharof Rashidov tumani": ["Uchariq", "Qang‘li", "Toqchilik"],
            "Zomin tumani": ["Zomin shahri", "Dashtobod", "Suffa", "Beshkubi"],
            "Baxmal tumani": ["O‘smat", "Baxmal markaz", "Novqa"],
            "G‘allaorol tumani": ["G‘allaorol shahri", "Marjonbuloq", "Madaniyat"],
            "Do‘stlik tumani": ["Do‘stlik shahri", "Navro‘z", "Oltin vodiy"],
            "Forish tumani": ["Yangiqishloq", "Egizbuloq", "Garasha"],
            "Mirzacho‘l tumani": ["Gagarin shahri", "Paxtazor", "Ipak yo‘li"],
            "Paxtakor tumani": ["Paxtakor shahri", "Oqbuloq", "Chamanzor"],
            "Yangiobod tumani": ["Balandchaqir", "Sovot", "Xovos"],
            "Zafarobod tumani": ["Zafarobod shahri", "Yorqin", "Pistalikent"],
            "Zarbdor tumani": ["Zarbdor shahri", "Bo‘ston", "Andijon"],
            "Arnasoy tumani": ["G‘oliblar", "Cho‘lquvar", "Baxtli"],
        },
    },
    "Sirdaryo viloyati": {
        "slug": "sirdaryo-viloyati",
        "districts": {
            "Guliston shahri": ["Sayqal", "Taraqqiyot", "Ulug‘obod", "Do‘stlik", "Namuna"],
            "Shirin shahri": ["Energetik", "Mirzo Ulug‘bek", "Farhod"],
            "Yangiyer shahri": ["Shukrona", "Tinchlik", "Binokor"],
            "Boyovut tumani": ["Boyovut shahri", "Bekat", "Madaniyat"],
            "Dehqonobod tumani": ["Dehqonobod markaz", "Mehnatkash", "G‘alaba"],
            "Guliston tumani": ["Dehqonobod", "Humo", "Zarbdor"],
            "Xovos tumani": ["Xovos shahri", "Binokor", "Gulsara"],
            "Mirzaobod tumani": ["Navro‘z", "Oqoltin", "Mirzacho‘l"],
            "Oqoltin tumani": ["Sardoba", "Farg‘ona", "Shodlik"],
            "Sardoba tumani": ["Paxtaobod", "Birlik", "Qo‘rg‘ontepa"],
            "Sayxunobod tumani": ["Sayxun", "Paxtakor", "Ittifoq"],
            "Sirdaryo tumani": ["Sirdaryo shahri", "Baxt shahri", "Malik"],
        },
    },
    "Qoraqalpog‘iston Respublikasi": {
        "slug": "qoraqalpogiston-respublikasi",
        "districts": {
            "Nukus shahri": ["Markaz", "G‘o‘ne qala", "Allayar Dosnazarov", "Temir jol", "Qattag‘ar"],
            "Amudaryo tumani": ["Mang‘it shahri", "Jumurtov", "Qilichboy"],
            "Beruniy tumani": ["Beruniy shahri", "Nayman", "Shabbaz"],
            "Chimboy tumani": ["Chimboy shahri", "Qamis ariq", "Keneges"],
            "Ellikqal’a tumani": ["Bo‘ston shahri", "Saribiy", "Toproqqala"],
            "Kegeyli tumani": ["Kegeyli shahri", "Aktuba", "Jalpak jap"],
            "Mo‘ynoq tumani": ["Mo‘ynoq shahri", "Uchsay", "Madeli"],
            "Nukus tumani": ["Oqmang‘it", "Koranik", "Samanbay"],
            "Qanliko‘l tumani": ["Qanliko‘l markaz", "Beshko‘prik", "Nawriz"],
            "Qo‘ng‘irot tumani": ["Qo‘ng‘irot shahri", "Jasliq", "Qaraqalpaqstan"],
            "Qorao‘zak tumani": ["Qorao‘zak markaz", "Qarakol", "Madanivat"],
            "Shumanay tumani": ["Shumanay shahri", "Begjap", "Birleshik"],
            "Taxtako‘pir tumani": ["Taxtako‘pir shahri", "Mulik", "Qo‘ng‘irotko‘l"],
            "To‘rtko‘l tumani": ["To‘rtko‘l shahri", "Taza bog‘", "Atawba"],
            "Xo‘jayli tumani": ["Xo‘jayli shahri", "Vodnik", "Sarishungul"],
            "Bo‘zatov tumani": ["Bo‘zatov shahri", "Erkindaryo", "Qusxanataw"],
            "Taxiatosh shahri": ["Energetik", "Nawayi", "Keneges"],
        },
    },
}

class Command(BaseCommand):
    help = "Seeds all 14 regions, districts, and neighborhoods of Uzbekistan"

    def handle(self, *args, **options):
        self.stdout.write("Seeding Uzbekistan locations...")
        total_regions = 0
        total_districts = 0
        total_neighborhoods = 0

        for reg_name, reg_data in UZBEKISTAN_LOCATIONS.items():
            region, _ = Region.objects.get_or_create(
                name=reg_name,
                defaults={"slug": reg_data["slug"]}
            )
            total_regions += 1

            for dist_name, neighborhoods in reg_data["districts"].items():
                import re
                slug = re.sub(r"[^a-z0-9]+", "-", f"{reg_data['slug']}-{dist_name}".lower()).strip("-")
                district, _ = District.objects.get_or_create(
                    region=region,
                    name=dist_name,
                    defaults={"slug": slug}
                )
                total_districts += 1

                for n_name in neighborhoods:
                    n_slug = re.sub(r"[^a-z0-9]+", "-", f"{slug}-{n_name}".lower()).strip("-")
                    Neighborhood.objects.get_or_create(
                        district=district,
                        name=n_name,
                        defaults={"slug": n_slug}
                    )
                    total_neighborhoods += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded: {total_regions} regions, {total_districts} districts, {total_neighborhoods} neighborhoods!"
            )
        )
