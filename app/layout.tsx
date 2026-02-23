import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { prisma } from '@/lib/prisma';
import { ContactActions } from '@/components/ContactActions';
import { WhatsAppFloatButton } from '@/components/WhatsAppFloatButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GabyGas',
  description: 'Sitio web oficial de GabyGas'
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

  return (
    <html lang="es">
      <body className={inter.className}>
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
