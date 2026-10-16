import type { MetadataRoute } from "next";
import { asset } from "@/lib/asset";

export const dynamic = "force-static";

// Installabile come app dalla schermata Home del telefono
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Libraccio.it – Offerte e Outlet",
    short_name: "Libraccio",
    description: "Libri nuovi, usati e scolastici in offerta, con Libby, la tua libraia digitale.",
    lang: "it",
    start_url: asset("/"),
    scope: asset("/"),
    display: "standalone",
    background_color: "#F9F9F9",
    theme_color: "#F9F9F9",
    icons: [
      { src: asset("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: asset("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: asset("/icons/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
