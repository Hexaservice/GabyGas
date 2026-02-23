import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { MUNICIPALITY_KEYWORDS, MUNICIPALITY_PAGES, buildPageMetadata } from '@/lib/seo';

type Props = {
  params: { city: string };
};

function getMunicipality(city: string) {
  return MUNICIPALITY_PAGES.find((item) => item.slug === city);
}

export function generateStaticParams() {
  return MUNICIPALITY_PAGES.map((item) => ({ city: item.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const municipality = getMunicipality(params.city);
  if (!municipality) return {};

  return buildPageMetadata({
    title: `${municipality.city}: servicio técnico e instalación de gas`,
    description: municipality.intro,
    path: `/cobertura/${municipality.slug}`,
    keywords: MUNICIPALITY_KEYWORDS[municipality.slug] ?? [],
  });
}

export default function MunicipalityCoveragePage({ params }: Props) {
  const municipality = getMunicipality(params.city);

  if (!municipality) {
    notFound();
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: municipality.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="space-y-6">
      <Script id={`faq-${municipality.slug}`} type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqSchema)}
      </Script>

      <header className="card space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">Cobertura local</p>
        <h1 className="h1">{municipality.headline}</h1>
        <p className="body-copy">{municipality.intro}</p>
      </header>

      <article className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <h2 className="text-lg font-semibold">Urgencias</h2>
          <p className="mt-2 text-sm text-slate-700">{municipality.emergencies}</p>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold">Mantenimiento</h2>
          <p className="mt-2 text-sm text-slate-700">{municipality.preventive}</p>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold">Instalación</h2>
          <p className="mt-2 text-sm text-slate-700">{municipality.installation}</p>
        </div>
      </article>

      <article className="card space-y-3">
        <h2 className="h2">Zonas frecuentes en {municipality.city}</h2>
        <div className="flex flex-wrap gap-2">
          {municipality.neighborhoods.map((neighborhood) => (
            <span key={neighborhood} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {neighborhood}
            </span>
          ))}
        </div>
      </article>

      <article className="card space-y-3">
        <h2 className="h2">Preguntas frecuentes en {municipality.city}</h2>
        {municipality.faqs.map((faq) => (
          <div key={faq.question} className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">{faq.question}</h3>
            <p className="mt-2 text-sm text-slate-700">{faq.answer}</p>
          </div>
        ))}
      </article>

      <article className="card space-y-2">
        <h2 className="h2">Solicita visita técnica</h2>
        <p className="text-sm text-slate-700">Agenda mantenimiento o instalación y recibe confirmación con alcance, tiempos y costo estimado.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/contacto" className="btn-primary">
            Solicitar cotización en {municipality.city}
          </Link>
          <Link href="/servicios" className="btn-outline">
            Ver servicios
          </Link>
        </div>
      </article>
    </section>
  );
}
