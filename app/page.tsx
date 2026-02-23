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
    image:
      'https://images.unsplash.com/photo-1621905252472-e8e8f0b1f4f8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Mantenimiento preventivo',
    text: 'Inspecciones programadas, ajustes y reporte técnico para garantizar continuidad operativa.',
    image:
      'https://images.unsplash.com/photo-1581093196277-9f60785a3c8f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Atención de emergencias',
    text: 'Respuesta prioritaria para fugas, anomalías de presión y paradas no planificadas.',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
  },
];

const coverage = ['Medellín', 'Bello', 'Envigado', 'Itagüí', 'Sabaneta', 'Copacabana'];

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

      <div className="card surface-glow grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">Propuesta de valor</p>
          <h1 className="h1 animate-float-slow">Energía de gas segura y profesional para hogares, comercio e industria</h1>
          <p className="body-copy">
            Modernizamos toda la experiencia con un entorno visual profesional, tienda activa, catálogo en línea y carrito listo para comprar.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/servicios" className="btn-primary">
              Ver servicios destacados
            </Link>
            <Link href="/tienda" className="btn-outline">
              Ir al catálogo
            </Link>
            <Link href="/checkout" className="btn-outline">
              Abrir carrito
            </Link>
          </div>
        </div>
        <div className="card hover-lift">
          <h2 className="text-lg font-semibold text-brand-100">Tienda y carrito activos</h2>
          <p className="mt-2 text-sm text-slate-300">Ya puedes agregar productos desde tienda y finalizar en checkout.</p>
          <div className="mt-4 grid gap-2">
            <Link href="/tienda" className="btn-primary w-full">
              Explorar tienda
            </Link>
            <Link href="/checkout" className="btn-outline w-full">
              Ver resumen de carrito
            </Link>
          </div>
        </div>
      </div>

      <article className="space-y-4">
        <h2 className="h2">Servicios destacados</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredServices.map((service) => (
            <article key={service.title} className="card hover-lift overflow-hidden p-0">
              <div className="h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }} />
              <div className="space-y-2 p-5">
                <h3 className="font-semibold text-brand-100">{service.title}</h3>
                <p className="body-copy">{service.text}</p>
              </div>
            </article>
          ))}
        </div>
      </article>

      <article className="card space-y-3">
        <h2 className="h2">Estrategia de keywords locales priorizadas</h2>
        <ul className="grid gap-2 text-sm text-slate-200 md:grid-cols-2">
          {LOCAL_KEYWORDS.map((keyword) => (
            <li key={keyword} className="rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 hover-lift">
              {keyword}
            </li>
          ))}
        </ul>
      </article>

      <article className="card space-y-3">
        <h2 className="h2">Cobertura Valle de Aburrá</h2>
        <div className="flex flex-wrap gap-2">
          {coverage.map((zone) => (
            <span key={zone} className="rounded-full bg-brand-500/20 px-3 py-1 text-sm text-brand-100">
              {zone}
            </span>
          ))}
        </div>
      </article>

      <article className="space-y-4">
        <h2 className="h2">Testimonios</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="card hover-lift">
              <p className="body-copy">“{item.quote}”</p>
              <footer className="mt-3 text-sm font-semibold text-brand-200">{item.name}</footer>
            </blockquote>
          ))}
        </div>
      </article>

      <article className="card space-y-3">
        <h2 className="h2">Marcas con las que trabajamos</h2>
        <div className="grid grid-cols-2 gap-3 text-center text-sm font-medium text-slate-200 md:grid-cols-6">
          {brands.map((brand) => (
            <div key={brand} className="hover-lift rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-3">
              {brand}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
