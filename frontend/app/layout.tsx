import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Usta Top — Ishonchli Mahalliy Ustalar Portali | Toshkent, O‘zbekiston",
  description:
    "Muammoingizni ayting, mos ustani topamiz. Santexnik, elektrik, konditsioner va boshqa sohalardagi 10,000+ tekshirilgan ustalar.",
  icons: {
    icon: "/assets/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={plusJakartaSans.variable}>
      <body className="bg-surface text-on-surface font-sans antialiased min-h-screen flex flex-col">
        <AppProviders>
          <Header />
          <div className="flex-1 pt-20 pb-16 md:pb-0">
            {children}
          </div>
          <Footer />
          <MobileNav />
        </AppProviders>
      </body>
    </html>
  );
}
