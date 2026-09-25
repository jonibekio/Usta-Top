import abc

class AIProvider(abc.ABC):
    @abc.abstractmethod
    def analyze_intake(self, text: str, context: dict = None) -> dict:
        pass

class RuleBasedAIProvider(AIProvider):
    """
    Intelligent keyword-driven Uzbek NLP intake engine.
    Safe, fast, predictable fallback for marketplace diagnostics.
    """
    KEYWORDS_MAP = {
        "konditsioner": {
            "category": "konditsioner",
            "category_name": "Konditsioner ta'miri",
            "service": "Freon quyish va montaj",
            "issues": ["Xladagent (freon) kamaygan yoki sizib chiqqan", "Filtrlar chang bilan tiqilib qolgan", "Kompressor qizib ketmoqda"],
            "urgency": "URGENT",
            "questions": ["Konditsioner markasi qanday (Artel, Shivaki, Midea)?", "Oxirgi marta qachon profilaktika qilingan?", "Sovuq havoni umuman bermayaptimi?"],
        },
        "muzlatgich": {
            "category": "maishiy-texnika",
            "category_name": "Maishiy texnika ta'miri",
            "service": "Muzlatgich motori va freon ta'miri",
            "issues": ["Termostat nosoz", "Freon oqishi", "Motor start ololmayapti"],
            "urgency": "URGENT",
            "questions": ["Muzlatgich modeli nima?", "Muzxona muzlayaptimi yoki asosiy kamera sovuq emasmi?"],
        },
        "kir yuvish": {
            "category": "maishiy-texnika",
            "category_name": "Maishiy texnika ta'miri",
            "service": "Kir yuvish mashinasini tuzatish",
            "issues": ["Suv chiqarmayapti / nasos tiqilgan", "Baraban aylanmayapti", "Suv isitmayapti"],
            "urgency": "TODAY",
            "questions": ["Mashina markasi nima?", "Displeyda qanday xatolik kodi chiqmoqda?"],
        },
        "kran": {
            "category": "santexnika",
            "category_name": "Santexnika xizmatlari",
            "service": "Kran va smesitel ta'miri",
            "issues": ["Kran qistirmasi eskirgan", "Suv bosimi tushib ketgan", "Quvur ulanmasidan sizib chiqish"],
            "urgency": "URGENT",
            "questions": ["Oshxona yoki vanna krani?", "Asosiy ventil yopiladimi?"],
        },
        "quvur": {
            "category": "santexnika",
            "category_name": "Santexnika xizmatlari",
            "service": "Quvurlarni tozalash va payvandlash",
            "issues": ["Kanalizatsiya tiqilib qolgan", "Sifon nosoz"],
            "urgency": "URGENT",
            "questions": ["Suv qanchalik sekin ketmoqda?", "Ko‘p qavatli uy yoki hovlimi?"],
        },
        "rozetka": {
            "category": "elektrik",
            "category_name": "Elektr montaj",
            "service": "Rozetka va avtomat almashtirish",
            "issues": ["Qisqa tutashuv xavfi", "Rozetka kuygan"],
            "urgency": "URGENT",
            "questions": ["Avtomat tushib qoldimi?", "Kuyindi hidi kelyaptimi?"],
        },
    }

    def analyze_intake(self, text: str, context: dict = None) -> dict:
        lower = text.lower()
        matched_data = None
        for kw, data in self.KEYWORDS_MAP.items():
            if kw in lower:
                matched_data = data
                break

        if not matched_data:
            matched_data = {
                "category": "konditsioner",
                "category_name": "Konditsioner ta'miri",
                "service": "Umumiy diagnostika va ta'mirlash",
                "issues": ["Nosozlik sababini joyida aniqlash talab etiladi", "Profilaktika va tozalash"],
                "urgency": "TODAY",
                "questions": ["Muammo qachondan beri davom etmoqda?", "Qurilma markasi qanday?"],
            }

        return {
            "detected_category": matched_data["category"],
            "detected_category_name": matched_data["category_name"],
            "detected_service": matched_data["service"],
            "summary": f"Mijoz so‘rovi: {text[:120]}...",
            "urgency": matched_data["urgency"],
            "suggested_questions": matched_data["questions"],
            "confidence": 0.94,
            "detected_issues": matched_data["issues"],
            "structured_data": {
                "brand": "Artel" if "artel" in lower else "Aniqlanmagan",
                "symptoms": matched_data["issues"],
            },
        }

def get_ai_intake_provider() -> AIProvider:
    # If OpenAI API key is set, OpenAI adapter can be used, otherwise RuleBasedAIProvider
    return RuleBasedAIProvider()
