export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-600">
      <div className="mx-auto max-w-6xl px-4">
        <p>© {new Date().getFullYear()} Canarinhos. Todos os direitos reservados.</p>
        <p className="mt-1 text-xs text-slate-400">Tradição, música e formação humana.</p>
      </div>
    </footer>
  );
}