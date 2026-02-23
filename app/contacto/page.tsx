export default function ContactoPage() {
  return (
    <section className="max-w-2xl space-y-4">
      <h1 className="h1">Contacto</h1>
      <form className="card space-y-3">
        <label className="block space-y-1 text-sm">
          <span>Nombre</span>
          <input className="field" type="text" placeholder="Tu nombre" />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Correo electrónico</span>
          <input className="field" type="email" placeholder="tu@email.com" />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Mensaje</span>
          <textarea className="field min-h-28" placeholder="¿Cómo podemos ayudarte?" />
        </label>
        <button type="button" className="btn-primary w-full md:w-auto">
          Enviar consulta
        </button>
      </form>
    </section>
  );
}
