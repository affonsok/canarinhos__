import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-canarinhos-blue px-4 py-20 text-center text-white">
        <h1 className="text-4xl font-extrabold tracking-tight text-canarinhos-gold md:text-5xl">
          Vozes que encantam gerações
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-200">
          Tradição musical, disciplina e arte reunidas em um só lugar. Conheça os Canarinhos e faça parte dessa história.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded bg-canarinhos-gold px-6 py-3 font-semibold text-canarinhos-blue hover:bg-yellow-400"
          >
            Acessar Área do Aluno
          </Link>
          <a
            href="#historia"
            className="rounded border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            Conhecer o Projeto
          </a>
        </div>
      </section>

      {/* História resumida */}
      <section id="historia" className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-2xl font-bold text-canarinhos-blue">Nossa História</h2>
        <p className="mt-4 leading-relaxed text-slate-700">
          Fundado com o propósito de unir educação musical e formação cidadã, o projeto Canarinhos mantém viva uma tradição de excelência vocal. Nossos ensaios combinam técnica, repertório diversificado e convivência, preparando crianças e jovens para palcos e para a vida.
        </p>
      </section>

      {/* Atividades */}
      <section id="atividades" className="bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-canarinhos-blue">Atividades</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: "Ensaios semanais", desc: "Técnica vocal, percepção musical e repertório em grupo." },
              { title: "Apresentações", desc: "Concertos, missas e eventos culturais ao longo do ano." },
              { title: "Formação integral", desc: "Disciplina, trabalho em equipe e desenvolvimento pessoal." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-canarinhos-blue">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}