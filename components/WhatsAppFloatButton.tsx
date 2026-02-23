import Link from 'next/link';

type Props = {
  whatsappLink: string;
};

export function WhatsAppFloatButton({ whatsappLink }: Props) {
  if (!whatsappLink) return null;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white shadow-lg transition hover:bg-emerald-600 md:bottom-6 md:right-6"
      aria-label="Abrir WhatsApp"
    >
      💬
    </Link>
  );
}
