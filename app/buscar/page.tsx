export default function BuscarPage() {
  return (
    <section className="max-w-2xl space-y-4">
      <h1 className="h1">Buscar</h1>
      <div className="card space-y-3">
        <label className="block space-y-1 text-sm">
          <span>Término de búsqueda</span>
          <input className="field" type="search" placeholder="Ejemplo: regulador doméstico" />
        </label>
        <button type="button" className="btn-primary">
          Buscar
        </button>
      </div>
    </section>
  );
}
