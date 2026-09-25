import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so‘m";
}

export function formatPriceRange(min: number, max: number): string {
  return `${new Intl.NumberFormat("uz-UZ").format(min)} – ${new Intl.NumberFormat("uz-UZ").format(max)} so‘m`;
}
