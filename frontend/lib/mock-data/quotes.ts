import { Quote } from "@/types";
import { MOCK_PROVIDERS } from "./providers";

const aliUsta = MOCK_PROVIDERS.find((p) => p.id === "ali-karimov")!;
const bekUsta = MOCK_PROVIDERS.find((p) => p.id === "bek-usta")!;
const davronTexnik = MOCK_PROVIDERS.find((p) => p.id === "davron-texnik")!;

export const MOCK_QUOTES: Quote[] = [
  {
    id: "quote-1",
    requestId: "req-8942",
    providerId: "ali-karimov",
    provider: aliUsta,
    serviceFee: 150000,
    partsFee: 80000,
    totalPrice: 230000,
    arrivalTime: "Bugun 18:00",
    warranty: "6 oy kafolat",
    notes: "R410A original freon quyish va drenaj trubkasini tozalash.",
    status: "ACCEPTED",
    createdAt: "2026-09-13T15:35:00Z",
  },
  {
    id: "quote-2",
    requestId: "req-8942",
    providerId: "bek-usta",
    provider: bekUsta,
    serviceFee: 180000,
    partsFee: 60000,
    totalPrice: 240000,
    arrivalTime: "Bugun 20:00",
    warranty: "3 oy kafolat",
    notes: "Freon quyish va bosim diagnostikasi.",
    status: "PENDING",
    createdAt: "2026-09-13T15:38:00Z",
  },
  {
    id: "quote-3",
    requestId: "req-8942",
    providerId: "davron-texnik",
    provider: davronTexnik,
    serviceFee: 210000,
    partsFee: 0,
    totalPrice: 210000,
    arrivalTime: "Ertaga 10:00",
    warranty: "1 oy kafolat",
    notes: "To'liq servis to'plami (diagnostika va gaz to'ldirish).",
    status: "PENDING",
    createdAt: "2026-09-13T15:42:00Z",
  },
];
