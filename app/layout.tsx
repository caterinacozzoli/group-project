import type { Metadata } from "next";
import { Bitter, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import DevicePreview from "@/components/DevicePreview";

const bitter = Bitter({ variable: "--font-bitter", subsets: ["latin"], weight: ["700"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "600"] });
// Il footer Figma usa Plus Jakarta Sans per le descrizioni dei servizi
const jakarta = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta", subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Offerte e Outlet - Libraccio.it",
  description: "Libri nuovi, usati e scolastici in offerta su Libraccio.it",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${bitter.variable} ${poppins.variable} ${jakarta.variable}`}>
      <body>
        {children}
        <DevicePreview />
      </body>
    </html>
  );
}
