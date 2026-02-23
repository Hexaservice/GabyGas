'use client';

import { useEffect, useMemo, useState } from 'react';

type CartItem = { id: string; name: string; quantity: number; price: number; subtotal: number };

type CartSummary = { items: CartItem[]; subtotal: number; totalItems: number };

type Zone = { id: string; name: string; city: string; shippingCost: number };

export function CheckoutClient({ zones }: { zones: Zone[] }) {
  const [cart, setCart] = useState<CartSummary>({ items: [], subtotal: 0, totalItems: 0 });
  const [zoneId, setZoneId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/cart')
      .then((res) => res.json())
      .then((data) => setCart(data));
  }, []);

  const shipping = useMemo(() => zones.find((zone) => zone.id === zoneId)?.shippingCost ?? 0, [zoneId, zones]);

  async function onSubmit(formData: FormData) {
    const payload = {
      ...Object.fromEntries(formData.entries()),
      coverageZoneId: zoneId || null,
    };

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message ?? 'No fue posible crear la orden.');
      return;
    }

    setMessage(`Orden ${data.orderId} creada. Redirige al pago.`);
    window.location.href = data.paymentUrl;
  }

  return (
    <section className="space-y-5">
      <h1 className="h1">Checkout</h1>
      <p className="body-copy">Completa tus datos, selecciona zona de cobertura y confirma tu pedido.</p>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <form action={onSubmit} className="card space-y-3">
          <input className="field" name="customerName" required placeholder="Nombre completo" />
          <input className="field" name="customerPhone" required placeholder="Teléfono" />
          <input className="field" name="customerAddress" required placeholder="Dirección" />
          <select className="field" value={zoneId} onChange={(event) => setZoneId(event.target.value)}>
            <option value="">Selecciona ciudad/zona de cobertura</option>
            {zones.map((zone) => (
              <option value={zone.id} key={zone.id}>
                {zone.city} - {zone.name}
              </option>
            ))}
          </select>
          <textarea className="field" name="notes" rows={4} placeholder="Notas del pedido" />
          <button className="btn-primary" type="submit">
            Pagar con Wompi (o flujo mock)
          </button>
          {message && <p className="text-sm text-brand-700">{message}</p>}
        </form>

        <aside className="card space-y-2">
          <h2 className="text-lg font-semibold">Resumen de pedido</h2>
          {cart.items.length === 0 && <p className="text-sm text-slate-500">Tu carrito está vacío.</p>}
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-3 text-sm">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>${item.subtotal.toLocaleString('es-CO')}</span>
            </div>
          ))}
          <hr />
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${cart.subtotal.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Envío</span>
            <span>${shipping.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${(cart.subtotal + shipping).toLocaleString('es-CO')}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
