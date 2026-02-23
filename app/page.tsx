import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="card grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">Energía segura y eficiente</p>
          <h1 className="h1">Instalaciones, mantenimiento y suministro para hogares y empresas</h1>
          <p className="body-copy">
            Plataforma full responsive para comunicar servicios, vender productos y captar oportunidades de negocio.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/servicios" className="btn-primary">
              Ver servicios
            </Link>
            <Link href="/tienda" className="btn-outline">
              Explorar tienda
            </Link>
          </div>
        </div>
        <div className="card bg-brand-50">
          <h2 className="text-lg font-semibold text-brand-900">¿Necesitas asesoría técnica?</h2>
          <p className="mt-2 text-sm text-slate-600">Nuestro equipo responde en menos de 24 horas.</p>
          <Link href="/contacto" className="btn-primary mt-4 w-full">
            Contactar ahora
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          "Cobertura nacional",
          "Atención especializada",
          "Cumplimiento normativo"
        ].map((item) => (
          <article key={item} className="card">
            <h3 className="font-semibold">{item}</h3>
            <p className="body-copy mt-2">Construido con un sistema de diseño consistente para escalar nuevas secciones rápidamente.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
