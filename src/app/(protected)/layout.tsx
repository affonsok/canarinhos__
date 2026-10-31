import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
      <Header hidePublicLinks />
      <main className="flex-1">{children}</main>
      <Footer hidePublicLinks />
    </div>
  );
}