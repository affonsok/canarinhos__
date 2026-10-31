import type { Metadata, Viewport } from "next";
import "@mantine/core/styles.css";
import "@/app/globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "@/theme";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const viewport: Viewport = {
  themeColor: "#0c1e38",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Canarinhos de Campo Largo — Ensaios & Repertório",
  description:
    "Portal e aplicativo oficial dos Canarinhos: ensaios, naipes, áudios e partituras.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Canarinhos",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <ColorSchemeScript />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900">
        <MantineProvider theme={theme}>
          <ServiceWorkerRegister />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
