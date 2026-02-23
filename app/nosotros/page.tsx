import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Nosotros | Equipo técnico de GabyGas',
  description: 'Conoce nuestro equipo especializado en soluciones de gas residenciales y comerciales en el Valle de Aburrá.',
  path: '/nosotros',
});

export default function NosotrosPage() {
  return (
    <section className="space-y-4">
      <h1 className="h1">Nosotros</h1>
      <p className="body-copy">Somos una empresa enfocada en soluciones de gas para clientes residenciales y corporativos.</p>
    </section>
  );
}
