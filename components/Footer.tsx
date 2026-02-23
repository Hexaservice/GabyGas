export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-layout grid gap-2 py-8 text-sm text-slate-600 md:grid-cols-2">
        <p>© {new Date().getFullYear()} GabyGas. Todos los derechos reservados.</p>
        <p className="md:text-right">Soluciones de gas residencial y comercial con cobertura nacional.</p>
      </div>
    </footer>
  );
}
