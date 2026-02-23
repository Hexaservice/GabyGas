import Link from 'next/link';

const services = [
  {
    title: 'Instalación certificada de redes de gas',
    alcance: 'Levantamiento, diseño, instalación de tubería, pruebas de hermeticidad y puesta en marcha.',
    tiempos: 'Desde 2 a 5 días hábiles según complejidad.',
    garantia: '12 meses en mano de obra y acompañamiento para inspección técnica.',
    precioDesde: '$180',
  },
  {
    title: 'Mantenimiento preventivo residencial y comercial',
    alcance: 'Inspección integral, limpieza de componentes, calibración y reporte con recomendaciones.',
    tiempos: 'Visitas programadas en 24 a 72 horas.',
    garantia: '90 días sobre ajustes realizados en la visita.',
    precioDesde: '$65',
  },
  {
    title: 'Corrección de fugas y emergencias',
    alcance: 'Detección de fuga, aislamiento del tramo, reparación y validación de seguridad final.',
    tiempos: 'Atención prioritaria el mismo día en zonas de cobertura.',
    garantia: '6 meses para la intervención efectuada.',
    precioDesde: '$95',
  },
];

export default function ServiciosPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="h1">Servicios</h1>
        <p className="body-copy">Fichas claras con alcance, tiempos de respuesta, garantía y precio referencial desde.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="card space-y-3">
            <h2 className="text-lg font-semibold">{service.title}</h2>
            <p className="text-sm text-slate-700"><strong>Alcance:</strong> {service.alcance}</p>
            <p className="text-sm text-slate-700"><strong>Tiempos:</strong> {service.tiempos}</p>
            <p className="text-sm text-slate-700"><strong>Garantía:</strong> {service.garantia}</p>
            <p className="text-base font-semibold text-brand-700">Precio desde: {service.precioDesde}</p>
            <Link href="/contacto" className="btn-primary w-full">
              Solicitar este servicio
            </Link>
          </article>
        ))}
      </div>

      <article className="card space-y-4">
        <h2 className="h2">Bloques de confianza</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold">Licencias y certificaciones</h3>
            <p className="body-copy mt-2">Técnicos con acreditaciones vigentes para instalaciones de gas doméstico y comercial.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold">Experiencia comprobada</h3>
            <p className="body-copy mt-2">Más de 10 años atendiendo proyectos residenciales, restaurantes y edificios.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold">Casos y reseñas</h3>
            <p className="body-copy mt-2">+500 atenciones anuales y calificación de satisfacción superior al 95%.</p>
          </div>
        </div>
      </article>
    </section>
  );
}
