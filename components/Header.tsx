import Link from "next/link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/tienda", label: "Tienda" },
  { href: "/contacto", label: "Contacto" },
  { href: "/buscar", label: "Buscar" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-layout flex flex-wrap items-center justify-between gap-3 py-4">
        <Link href="/" className="text-lg font-bold text-brand-900">
          GabyGas
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm md:gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-100">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/contacto" className="btn-primary">
          Solicitar cotización
        </Link>
      </div>
    </header>
  );
}
