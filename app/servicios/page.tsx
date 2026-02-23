export default function ServiciosPage() {
  return (
    <section className="space-y-4">
      <h1 className="h1">Servicios</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="card">
          <h2 className="font-semibold">Instalación certificada</h2>
          <p className="body-copy mt-2">Diseño e implementación de redes internas con estándares de seguridad.</p>
        </article>
        <article className="card">
          <h2 className="font-semibold">Mantenimiento preventivo</h2>
          <p className="body-copy mt-2">Planes periódicos para mantener la operación estable y segura.</p>
        </article>
      </div>
    </section>
  );
}
