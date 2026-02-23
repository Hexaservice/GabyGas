import Link from 'next/link';

type Props = {
  supportPhone: string;
  whatsappLink: string;
};

export function ContactActions({ supportPhone, whatsappLink }: Props) {
  const normalizedPhone = supportPhone.replace(/\s+/g, '');

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:bottom-4 md:left-1/2 md:right-auto md:w-auto md:-translate-x-1/2 md:rounded-full md:border md:shadow-soft">
      <div className="container-layout flex items-center justify-center gap-2 py-2 md:px-3 md:py-3">
        <a href={normalizedPhone ? `tel:${normalizedPhone}` : '#'} className="btn-outline" aria-disabled={!normalizedPhone}>
          Llamar
        </a>
        <a href={whatsappLink || '#'} target="_blank" rel="noreferrer" className="btn-outline" aria-disabled={!whatsappLink}>
          WhatsApp
        </a>
        <Link href="/contacto" className="btn-primary">
          Solicitar visita
        </Link>
      </div>
    </div>
  );
}
