import Link from 'next/link';

const featuredServices = [
  {
    title: 'Instalación certificada',
    text: 'Diseño e instalación de redes de gas para viviendas, comercios e industrias con personal acreditado.',
  },
  {
    title: 'Mantenimiento preventivo',
    text: 'Inspecciones programadas, ajustes y reporte técnico para garantizar continuidad operativa.',
  },
  {
    title: 'Atención de emergencias',
    text: 'Respuesta prioritaria para fugas, anomalías de presión y paradas no planificadas.',
  },
];

const coverage = ['Quito y Valles', 'Guayaquil y Daule', 'Cuenca metropolitana', 'Ambato y Latacunga', 'Manta y Portoviejo', 'Santo Domingo'];

const testimonials = [
  {
    name: 'María P., administradora de condominio',
    quote: 'Resolvieron una actualización completa de red sin interrumpir el servicio del edificio.',
  },
  {
    name: 'Carlos R., gerente de restaurante',
    quote: 'Su mantenimiento trimestral nos ayudó a pasar auditorías sin observaciones.',
  },
];

const brands = ['Indurama', 'Mabe', 'Rheem', 'Bosch', 'Haceb', 'Teka'];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="card grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">Propuesta de valor</p>
          <h1 className="h1">Energía de gas segura, continua y certificada para hogares y empresas</h1>
          <p className="body-copy">
            Ejecutamos proyectos llave en mano con técnicos especializados, tiempos comprometidos y cumplimiento normativo en cada visita.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/servicios" className="btn-primary">
              Ver servicios destacados
            </Link>
            <Link href="/contacto" className="btn-outline">
              Solicitar diagnóstico
            </Link>
          </div>
        </div>
        <div className="card bg-brand-50">
          <h2 className="text-lg font-semibold text-brand-900">CTA principal</h2>
          <p className="mt-2 text-sm text-slate-600">Agenda una visita técnica y recibe propuesta en menos de 24 horas hábiles.</p>
          <Link href="/contacto" className="btn-primary mt-4 w-full">
            Solicitar visita técnica
          </Link>
        </div>
      </div>

      <article className="space-y-4">
        <h2 className="h2">Servicios destacados</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredServices.map((service) => (
            <article key={service.title} className="card">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="body-copy mt-2">{service.text}</p>
            </article>
          ))}
        </div>
      </article>

      <article className="card space-y-3">
        <h2 className="h2">Cobertura</h2>
        <div className="flex flex-wrap gap-2">
          {coverage.map((zone) => (
            <span key={zone} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {zone}
            </span>
          ))}
        </div>
      </article>

      <article className="space-y-4">
        <h2 className="h2">Testimonios</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="card">
              <p className="body-copy">“{item.quote}”</p>
              <footer className="mt-3 text-sm font-semibold text-slate-800">{item.name}</footer>
            </blockquote>
          ))}
        </div>
      </article>

      <article className="card space-y-3">
        <h2 className="h2">Marcas con las que trabajamos</h2>
        <div className="grid grid-cols-2 gap-3 text-center text-sm font-medium text-slate-600 md:grid-cols-6">
          {brands.map((brand) => (
            <div key={brand} className="rounded-lg border border-slate-200 bg-white px-2 py-3">
              {brand}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
