import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, MapPin, Smartphone, Play } from "lucide-react";
import UstaTopLogo from "../ui/UstaTopLogo";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low mt-10 border-t border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col items-start gap-4">
            <UstaTopLogo />
            <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Muammoingizni ayting. Ishonchli ustani toping. O‘zbekiston bo‘ylab eng saralangan va tekshirilgan usta mutaxassislar portali.
            </p>
            <div className="flex items-center gap-1.5 text-on-tertiary-fixed-variant bg-tertiary-fixed/30 px-3 py-1.5 rounded-md">
              <ShieldCheck className="w-4 h-4 text-tertiary-container shrink-0" />
              <span className="text-xs font-semibold">
                100% Tasdiqlangan Ustalar va Kafolatli Xizmat
              </span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
              Xizmatlar
            </h4>
            <div className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <Link href="/xizmatlar?category=santexnika" className="hover:text-primary transition-colors">
                Santexnika
              </Link>
              <Link href="/xizmatlar?category=elektrik" className="hover:text-primary transition-colors">
                Elektrik
              </Link>
              <Link href="/xizmatlar?category=konditsioner" className="hover:text-primary transition-colors">
                Konditsioner
              </Link>
              <Link href="/xizmatlar?category=maishiy-texnika" className="hover:text-primary transition-colors">
                Maishiy texnika
              </Link>
              <Link href="/xizmatlar?category=remont" className="hover:text-primary transition-colors">
                Remont
              </Link>
              <Link href="/xizmatlar?category=tozalash" className="hover:text-primary transition-colors">
                Tozalash
              </Link>
            </div>
          </div>

          {/* Col 3: For Customers */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
              Mijozlarga
            </h4>
            <div className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <Link href="/#kafolat" className="hover:text-primary transition-colors">
                Xavfsiz to‘lov
              </Link>
              <Link href="/#kafolat" className="hover:text-primary transition-colors">
                Kafolat
              </Link>
              <Link href="/#kafolat" className="hover:text-primary transition-colors">
                Baholash tizimi
              </Link>
              <Link href="/#qanday-ishlaydi" className="hover:text-primary transition-colors">
                Yordam markazi
              </Link>
            </div>
          </div>

          {/* Col 4: Contact & Apps */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
              Aloqa va Ilovalar
            </h4>
            <div className="flex flex-col gap-2 text-on-surface-variant text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span className="font-bold text-on-surface">+998 71 200-00-00</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-on-surface-variant shrink-0" />
                <span>Toshkent, O‘zbekiston</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-lg border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors">
                <Smartphone className="w-6 h-6 text-on-surface shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold">
                    Yuklab oling
                  </span>
                  <span className="text-xs font-bold text-on-surface">App Store</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-lg border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors">
                <Play className="w-6 h-6 text-on-surface shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold">
                    Yuklab oling
                  </span>
                  <span className="text-xs font-bold text-on-surface">Google Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant text-center sm:text-left">
            2025 © Usta Top. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-6 text-xs text-on-surface-variant">
            <Link href="/#kafolat" className="hover:text-on-surface transition-colors">
              Maxfiylik siyosati
            </Link>
            <Link href="/#kafolat" className="hover:text-on-surface transition-colors">
              Foydalanish shartlari
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
