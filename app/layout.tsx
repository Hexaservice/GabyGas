import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { prisma } from '@/lib/prisma';
import { ContactActions } from '@/components/ContactActions';
import { WhatsAppFloatButton } from '@/components/WhatsAppFloatButton';
import { LOCAL_KEYWORDS, SITE_NAME, SITE_URL, buildCanonical } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

const defaultTitle = `${SITE_NAME} | Instalación y mantenimiento de gas en el Valle de Aburrá`;
const defaultDescription =
  'Servicio técnico de gas en Medellín, Bello y Envigado. Instalación certificada, mantenimiento preventivo y atención de emergencias con cobertura metropolitana.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  keywords: LOCAL_KEYWORDS,
  alternates: {
    canonical: buildCanonical('/'),
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: buildCanonical('/'),
    type: 'website',
    locale: 'es_CO',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

function buildWhatsappLink(number: string, message: string) {
  const normalized = number.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message.trim());

  if (!normalized) return '';

  return `https://wa.me/${normalized}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const supportPhone = settings?.supportPhone ?? '';
  const whatsappNumber = settings?.whatsappNumber ?? '';
  const whatsappMessage = settings?.seoDescription ?? '';
  const whatsappLink = settings?.seoCanonical?.trim() || buildWhatsappLink(whatsappNumber, whatsappMessage);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    areaServed: ['Medellín', 'Bello', 'Envigado', 'Itagüí', 'Sabaneta', 'Valle de Aburrá'],
    telephone: supportPhone || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Medellín',
      addressRegion: 'Antioquia',
      addressCountry: 'CO',
    },
    sameAs: [settings?.facebookUrl, settings?.instagramUrl, settings?.youtubeUrl].filter(Boolean),
  };

  return (
    <html lang="es">
      <body className={inter.className}>
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { page_path: window.location.pathname });`}
            </Script>
          </>
        ) : null}

        <Script id="localbusiness-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(localBusinessSchema)}
        </Script>

        <div className="flex min-h-screen flex-col pb-20 md:pb-0">
          <Header />
          <main className="container-layout flex-1 py-8 md:py-12">{children}</main>
          <Footer />
          <ContactActions supportPhone={supportPhone} whatsappLink={whatsappLink} />
          <WhatsAppFloatButton whatsappLink={whatsappLink} />
        </div>
      </body>
    </html>
  );
}
