import "@mantine/core/styles.css";
import "@/app/globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "@/theme";

export const metadata = {
  title: "Canarinhos - Tradição e Música",
  description:
    "Portal oficial dos Canarinhos: ensaios, naipes, áudios e partituras.",
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
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
