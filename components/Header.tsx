import Link from 'next/link';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/cobertura/medellin', label: 'Cobertura' },
  { href: '/tienda', label: 'Tienda / Catálogo' },
  { href: '/checkout', label: 'Carrito / Checkout' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/buscar', label: 'Buscar' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-700/60 bg-slate-950/90 backdrop-blur">
      <div className="container-layout flex flex-wrap items-center justify-between gap-3 py-3">
        <Link href="/" className="group flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-white/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-200/60 bg-gradient-to-br from-brand-200 via-brand-400 to-brand-600 text-xl shadow-soft">
            🔥
          </div>
          <div>
            <p className="text-base font-bold text-white">GabyGas</p>
            <p className="text-xs text-slate-300">Gas residencial y comercial</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm md:gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/tienda" className="btn-outline hidden sm:inline-flex">
            Ver tienda
          </Link>
          <Link href="/checkout" className="btn-primary">
            Ver carrito
          </Link>
        </div>
      </div>
    </header>
  );
}
