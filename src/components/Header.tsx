import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-slate-200 bg-canarinhos-blue text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-wide text-canarinhos-gold">
          CANARINHOS
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium md:gap-5">
          <Link href="/#historia" className="hidden hover:text-canarinhos-gold sm:inline">
            História
          </Link>
          <Link href="/#atividades" className="hidden hover:text-canarinhos-gold sm:inline">
            Atividades
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/ensaios"
                className="rounded bg-canarinhos-gold px-4 py-2 font-semibold text-canarinhos-blue hover:bg-yellow-400"
              >
                Área de Ensaios
              </Link>
              <Link
                href="/api/auth/signout"
                className="text-xs text-slate-300 hover:text-white underline"
              >
                Sair
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded bg-canarinhos-gold px-4 py-2 font-semibold text-canarinhos-blue hover:bg-yellow-400"
            >
              Área do Aluno
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
