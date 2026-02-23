import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';
import { LOCAL_KEYWORDS, buildCanonical, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Instalación de gas en Medellín, Bello y Envigado',
  description:
    'Especialistas en instalación y mantenimiento de gas en el Valle de Aburrá. Atención técnica certificada en Medellín, Bello y Envigado.',
  path: '/',
});

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

const coverage = ['Medellín', 'Bello', 'Envigado', 'Itagüí', 'Sabaneta', 'Copacabana'];

const localLandingLinks = [
  {
    city: 'Medellín',
    href: '/cobertura/medellin',
    description: 'Instalación de gas en Medellín para hogares y comercios.',
  },
  {
    city: 'Bello',
    href: '/cobertura/bello',
    description: 'Mantenimiento de gas en Bello con agenda prioritaria.',
  },
  {
    city: 'Envigado',
    href: '/cobertura/envigado',
    description: 'Técnico de gas en Envigado para revisión y emergencias.',
  },
];

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

const faqItems = [
  {
    question: '¿Atienden urgencias por fuga de gas en el Valle de Aburrá?',
    answer: 'Sí, contamos con atención prioritaria para Medellín, Bello y Envigado según disponibilidad por zona.',
  },
  {
    question: '¿Cada cuánto recomiendan mantenimiento preventivo?',
    answer: 'En viviendas se recomienda mínimo una revisión anual; en comercios de alta demanda, revisiones semestrales.',
  },
];

export default function HomePage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Instalación y mantenimiento de redes de gas',
    areaServed: ['Medellín', 'Bello', 'Envigado', 'Valle de Aburrá'],
    provider: {
      '@type': 'LocalBusiness',
      name: 'GabyGas',
      url: buildCanonical('/'),
    },
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Servicio técnico de gas residencial',
    description: 'Intervención técnica para instalación, mantenimiento y corrección de fuga.',
    brand: {
      '@type': 'Brand',
      name: 'GabyGas',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="space-y-8">
      <Script id="service-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(serviceSchema)}
      </Script>
      <Script id="product-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(productSchema)}
      </Script>
      <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqSchema)}
      </Script>

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

      <article className="card space-y-3">
        <h2 className="h2">Estrategia de keywords locales priorizadas</h2>
        <ul className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
          {LOCAL_KEYWORDS.map((keyword) => (
            <li key={keyword} className="rounded-md border border-slate-200 px-3 py-2">
              {keyword}
            </li>
          ))}
        </ul>
      </article>

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
        <h2 className="h2">Cobertura Valle de Aburrá</h2>
        <div className="flex flex-wrap gap-2">
          {coverage.map((zone) => (
            <span key={zone} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {zone}
            </span>
          ))}
        </div>
      </article>

      <article className="card space-y-3">
        <h2 className="h2">Páginas locales por municipio</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {localLandingLinks.map((item) => (
            <Link key={item.city} href={item.href} className="rounded-lg border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50">
              <h3 className="font-semibold text-slate-900">{item.city}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </Link>
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
