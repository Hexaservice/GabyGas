'use client';

import { useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  categorySlug: string;
  brand: string | null;
  price: number;
  stock: number;
};

type Service = {
  id: string;
  name: string;
  shortDescription: string | null;
};

type Props = {
  products: Product[];
  services: Service[];
  categories: Array<{ slug: string; name: string }>;
  brands: string[];
};

export function TiendaCatalogo({ products, services, categories, brands }: Props) {
  const [category, setCategory] = useState('todas');
  const [brand, setBrand] = useState('todas');
  const [type, setType] = useState<'todos' | 'producto' | 'servicio'>('todos');
  const [leadMessage, setLeadMessage] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (category !== 'todas' && product.categorySlug !== category) return false;
      if (brand !== 'todas' && (product.brand ?? 'Sin marca') !== brand) return false;
      return true;
    });
  }, [products, category, brand]);

  async function addToCart(productId: string) {
    await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    setLeadMessage('Producto agregado al carrito. Continúa en checkout.');
  }

  async function submitLead(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setLeadMessage(data.message ?? 'Solicitud enviada');
  }

  return (
    <section className="space-y-5">
      <h1 className="h1">Tienda</h1>
      <p className="body-copy">Filtra por categoría, marca o tipo y compra online o solicita instalación/mantenimiento.</p>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <select className="field" value={type} onChange={(e) => setType(e.target.value as 'todos' | 'producto' | 'servicio')}>
          <option value="todos">Todos</option>
          <option value="producto">Productos</option>
          <option value="servicio">Servicios</option>
        </select>
        <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="todas">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <select className="field" value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="todas">Todas las marcas</option>
          {brands.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {(type === 'todos' || type === 'producto') && (
        <div className="space-y-2">
          <h2 className="h2">Productos</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article key={product.id} className="card space-y-2">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-slate-600">{product.description}</p>
                <p className="text-xs text-slate-500">Categoría: {product.category} · Marca: {product.brand ?? 'Sin marca'}</p>
                <p className="font-semibold text-brand-700">${product.price.toLocaleString('es-CO')}</p>
                <button className="btn-primary w-full" onClick={() => addToCart(product.id)} disabled={product.stock <= 0}>
                  {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                </button>
              </article>
            ))}
          </div>
        </div>
      )}

      {(type === 'todos' || type === 'servicio') && (
        <div className="space-y-2">
          <h2 className="h2">Servicios</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="card">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="text-sm text-slate-600">{service.shortDescription}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      <form action={submitLead} className="card space-y-3">
        <h2 className="text-xl font-semibold">Solicitar instalación / mantenimiento</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="field" name="fullName" placeholder="Nombre completo" required />
          <input className="field" name="phone" placeholder="Teléfono" required />
          <input className="field" name="email" placeholder="Correo (opcional)" type="email" />
          <input className="field" name="city" placeholder="Ciudad / Zona" />
          <select name="serviceType" className="field" required>
            <option value="">Tipo de solicitud</option>
            <option value="instalacion">Instalación</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
          <input className="field" name="address" placeholder="Dirección" />
        </div>
        <textarea className="field" name="notes" placeholder="Detalle de la necesidad" rows={3} />
        <button className="btn-outline" type="submit">
          Enviar solicitud
        </button>
        {leadMessage && <p className="text-sm text-brand-700">{leadMessage}</p>}
      </form>
    </section>
  );
}
