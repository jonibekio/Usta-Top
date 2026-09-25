import { ServiceRequest } from "@/types";

export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: "req-8942",
    code: "UT-8942",
    categoryId: "konditsioner",
    categoryName: "Konditsioner ustasi (Ta‘mirlash va profilaktika)",
    problemDescription: "Konditsionerim ishlamayapti va sovutmayapti",
    detectedIssues: [
      "Freon yetishmovchiligi yoki filtr tiqilishi",
      "Ichki blokdan suv oqmoqda",
    ],
    answers: {
      timeframe: "Bugun to‘satdan to‘xtadi",
      condition: "Ha, pultdan yoqiladi lekin sovuq bermayapti",
      additionalSymptoms: ["Ichki blokdan suv oqmoqda"],
      brand: "Artel",
    },
    location: {
      city: "Toshkent",
      district: "Chilonzor tumani",
      address: "Toshkent, Chilonzor tumani, 9-mavze, 14-uy, 28-xonadon",
      coordinates: [41.2789, 69.2154],
    },
    urgency: "URGENT",
    urgencyText: "⚡ Shoshilinch (1-2 soat)",
    status: "ASSIGNED",
    createdAt: "2026-09-13T15:20:00Z",
    matchedMasterIds: ["ali-karimov", "bek-usta", "davron-texnik"],
    hasAudio: true,
    audioDuration: "0:18",
    photos: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDaSYEf7wd2MICzJZuaPGSbfrEvJVYxe0OcpCk-ovheiyqxupIlTHYRlkI2FVeLz8py66zIVkmG7_nzMGsVhG8wz7KG8eHk5ztvTwd3LOscIh6iuVqIMcMsLkaoKqjRcpp_Nt2ve_89TtVlDAdFGqlCWb-mSEF-c1lyy4_BcwopSjppYtjmrDe-gs5v1HMG-KFlvSW6_ieLFWIsi-dGnUPzN637UXXvpMU5fp9u9Ep0kO08SadDO28kww",
    ],
  },
  {
    id: "req-8941",
    code: "UT-8941",
    categoryId: "santexnika",
    categoryName: "Santexnika",
    problemDescription: "Oshxona krani oqyapti va mikser almashtirish kerak",
    detectedIssues: ["Kran kartriji yemirilgan"],
    answers: {
      timeframe: "Kecha kechqurun",
      condition: "Suv to'xtovsiz sizib chiqmoqda",
      additionalSymptoms: ["Bosim pasayishi"],
      brand: "Standart",
    },
    location: {
      city: "Toshkent",
      district: "Yunusobod",
      address: "Yunusobod 4-mavze",
    },
    urgency: "TODAY",
    urgencyText: "Bugun kechqurun",
    status: "COMPLETED",
    createdAt: "2026-09-12T10:00:00Z",
    matchedMasterIds: ["akmal-jorayev"],
    hasAudio: false,
    photos: [],
  },
];
