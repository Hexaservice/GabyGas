'use client';

import { ChangeEvent, useMemo, useState } from 'react';

type BannerItem = {
  id: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  imageUrl: string | null;
  isActive: boolean;
  priority: number;
};

type ServiceItem = { id: string; name: string; shortDescription: string | null; isFeatured: boolean };
type ProductItem = { id: string; name: string; imageUrl: string | null; price: string; stock: number; isActive: boolean };
type CoverageItem = { id: string; name: string; city: string; isActive: boolean };

type SiteSettingsData = {
  supportPhone: string;
  whatsappNumber: string;
  whatsappLink: string;
  whatsappPrefilledMessage: string;
  logoUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
};

type AuditItem = {
  id: string;
  action: string;
  createdAt: string;
  actorEmail: string | null;
};

type Props = {
  initialSettings: SiteSettingsData;
  banners: BannerItem[];
  services: ServiceItem[];
  products: ProductItem[];
  coverageZones: CoverageItem[];
  history: AuditItem[];
};

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

async function optimizeImage(file: File): Promise<File> {
  const img = document.createElement('img');
  const objectUrl = URL.createObjectURL(file);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    img.src = objectUrl;
  });

  const maxWidth = 1600;
  const scale = img.width > maxWidth ? maxWidth / img.width : 1;
  const targetWidth = Math.round(img.width * scale);
  const targetHeight = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext('2d');

  if (!context) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('No se pudo preparar la optimización de imagen.');
  }

  context.drawImage(img, 0, 0, targetWidth, targetHeight);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((value) => resolve(value), 'image/webp', 0.82);
  });

  URL.revokeObjectURL(objectUrl);

  if (!blob) {
    throw new Error('No se pudo optimizar la imagen.');
  }

  return new File([blob], `${file.name.replace(/\.[^/.]+$/, '')}.webp`, { type: 'image/webp' });
}

export function WebmasterDashboard({ initialSettings, banners, services, products, coverageZones, history }: Props) {
  const [draft, setDraft] = useState(initialSettings);
  const [selectedBannerId, setSelectedBannerId] = useState<string>(banners[0]?.id ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedBanner = useMemo(() => banners.find((item) => item.id === selectedBannerId), [banners, selectedBannerId]);
  const [bannerForm, setBannerForm] = useState(() => ({
    title: banners[0]?.title ?? '',
    subtitle: banners[0]?.subtitle ?? '',
    ctaLabel: banners[0]?.ctaLabel ?? '',
    ctaUrl: banners[0]?.ctaUrl ?? '',
    imageUrl: banners[0]?.imageUrl ?? '',
  }));

  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');

  function setField<K extends keyof SiteSettingsData>(key: K, value: SiteSettingsData[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function applyWhatsAppDerivedData(nextNumber: string, nextMessage: string) {
    const normalized = nextNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(nextMessage.trim());
    const link = normalized ? `https://wa.me/${normalized}${encodedMessage ? `?text=${encodedMessage}` : ''}` : '';

    setDraft((prev) => ({
      ...prev,
      whatsappNumber: nextNumber,
      whatsappPrefilledMessage: nextMessage,
      whatsappLink: link,
    }));
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/webmaster/upload', { method: 'POST', body: formData });
    const data = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !data.url) {
      throw new Error(data.error ?? 'No se pudo cargar la imagen.');
    }

    return data.url;
  }

  async function handleImageInput(event: ChangeEvent<HTMLInputElement>, target: 'logo' | 'banner') {
    setMessage(null);
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setMessage('Formato inválido. Solo se permite JPG, PNG o WEBP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage('El archivo excede 5MB.');
      return;
    }

    try {
      const optimized = await optimizeImage(file);
      const uploadedUrl = await uploadImage(optimized);

      if (target === 'logo') {
        setField('logoUrl', uploadedUrl);
        setPreviewImageUrl(uploadedUrl);
      } else {
        setBannerForm((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      }

      setMessage('Imagen cargada y optimizada correctamente.');
    } catch (error) {
      const content = error instanceof Error ? error.message : 'No se pudo procesar la imagen.';
      setMessage(content);
    }
  }

  async function publishChanges() {
    setSaving(true);
    setMessage(null);

    const response = await fetch('/api/webmaster/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setMessage(payload.error ?? 'Error al publicar cambios.');
      setSaving(false);
      return;
    }

    setMessage('Cambios publicados exitosamente.');
    setSaving(false);
  }

  async function saveBanner() {
    if (!selectedBannerId) return;

    setSaving(true);
    setMessage(null);

    const response = await fetch('/api/webmaster/banner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bannerId: selectedBannerId, ...bannerForm }),
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessage(payload.error ?? 'No se pudo guardar el banner.');
    } else {
      setMessage('Banner actualizado. Recarga para ver la lista sincronizada.');
    }

    setSaving(false);
  }

  async function revertByAudit(auditLogId: string) {
    setSaving(true);
    const response = await fetch('/api/webmaster/revert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditLogId }),
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessage(payload.error ?? 'No se pudo revertir.');
    } else {
      setMessage('Versión revertida. Recarga para actualizar vista.');
    }

    setSaving(false);
  }

  return (
    <section className="space-y-8">
      <h1 className="h1">Dashboard Webmaster</h1>
      {message ? <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="card space-y-3">
          <h2 className="text-lg font-semibold">Módulo: Logo</h2>
          <input type="file" accept="image/*" onChange={(event) => handleImageInput(event, 'logo')} />
          <input className="field" value={draft.logoUrl} onChange={(event) => setField('logoUrl', event.target.value)} placeholder="URL del logo" />
          {draft.logoUrl ? <img src={previewImageUrl || draft.logoUrl} alt="Logo" className="h-20 rounded-md object-contain" /> : null}
        </article>

        <article className="card space-y-3">
          <h2 className="text-lg font-semibold">Módulo: Teléfonos</h2>
          <input className="field" value={draft.supportPhone} onChange={(event) => setField('supportPhone', event.target.value)} placeholder="Teléfono visible" />
        </article>

        <article className="card space-y-3">
          <h2 className="text-lg font-semibold">Módulo: WhatsApp</h2>
          <input
            className="field"
            value={draft.whatsappNumber}
            onChange={(event) => applyWhatsAppDerivedData(event.target.value, draft.whatsappPrefilledMessage)}
            placeholder="Número WhatsApp"
          />
          <textarea
            className="field min-h-24"
            value={draft.whatsappPrefilledMessage}
            onChange={(event) => applyWhatsAppDerivedData(draft.whatsappNumber, event.target.value)}
            placeholder="Mensaje prellenado"
          />
          <input className="field" value={draft.whatsappLink} onChange={(event) => setField('whatsappLink', event.target.value)} placeholder="Link directo" />
        </article>

        <article className="card space-y-3">
          <h2 className="text-lg font-semibold">Módulo: Redes sociales</h2>
          <input className="field" value={draft.facebookUrl} onChange={(event) => setField('facebookUrl', event.target.value)} placeholder="Facebook" />
          <input className="field" value={draft.instagramUrl} onChange={(event) => setField('instagramUrl', event.target.value)} placeholder="Instagram" />
          <input className="field" value={draft.tiktokUrl} onChange={(event) => setField('tiktokUrl', event.target.value)} placeholder="TikTok" />
          <input className="field" value={draft.youtubeUrl} onChange={(event) => setField('youtubeUrl', event.target.value)} placeholder="YouTube" />
        </article>

        <article className="card space-y-3 md:col-span-2 xl:col-span-3">
          <h2 className="text-lg font-semibold">Módulo: Banners</h2>
          <select
            className="field"
            value={selectedBannerId}
            onChange={(event) => {
              const next = banners.find((item) => item.id === event.target.value);
              setSelectedBannerId(event.target.value);
              setBannerForm({
                title: next?.title ?? '',
                subtitle: next?.subtitle ?? '',
                ctaLabel: next?.ctaLabel ?? '',
                ctaUrl: next?.ctaUrl ?? '',
                imageUrl: next?.imageUrl ?? '',
              });
            }}
          >
            {banners.map((item) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
          <div className="grid gap-2 md:grid-cols-2">
            <input className="field" value={bannerForm.title} onChange={(event) => setBannerForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Título" />
            <input className="field" value={bannerForm.subtitle} onChange={(event) => setBannerForm((prev) => ({ ...prev, subtitle: event.target.value }))} placeholder="Subtítulo" />
            <input className="field" value={bannerForm.ctaLabel} onChange={(event) => setBannerForm((prev) => ({ ...prev, ctaLabel: event.target.value }))} placeholder="Texto botón" />
            <input className="field" value={bannerForm.ctaUrl} onChange={(event) => setBannerForm((prev) => ({ ...prev, ctaUrl: event.target.value }))} placeholder="URL botón" />
          </div>
          <input type="file" accept="image/*" onChange={(event) => handleImageInput(event, 'banner')} />
          {bannerForm.imageUrl ? <img src={bannerForm.imageUrl} alt="Banner" className="h-36 w-full rounded-md object-cover" /> : null}
          <button className="btn-outline" type="button" onClick={saveBanner} disabled={saving || !selectedBanner}>Guardar banner</button>
        </article>

        <article className="card xl:col-span-3">
          <h2 className="text-lg font-semibold">Módulos: Servicios, Productos y Cobertura</h2>
          <p className="text-sm text-slate-600">Servicios: {services.length} | Productos: {products.length} | Cobertura: {coverageZones.length}</p>
        </article>
      </div>

      <article className="card space-y-3">
        <h2 className="text-lg font-semibold">Previsualización antes de publicar</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-3 text-sm">
            <p><strong>Teléfono visible:</strong> {draft.supportPhone || '—'}</p>
            <p><strong>WhatsApp:</strong> {draft.whatsappNumber || '—'}</p>
            <p><strong>Link directo:</strong> {draft.whatsappLink || '—'}</p>
            <p><strong>Mensaje:</strong> {draft.whatsappPrefilledMessage || '—'}</p>
          </div>
          <div className="rounded-md border border-slate-200 p-3 text-sm">
            <p><strong>Facebook:</strong> {draft.facebookUrl || '—'}</p>
            <p><strong>Instagram:</strong> {draft.instagramUrl || '—'}</p>
            <p><strong>TikTok:</strong> {draft.tiktokUrl || '—'}</p>
            <p><strong>YouTube:</strong> {draft.youtubeUrl || '—'}</p>
          </div>
        </div>
        <button className="btn-primary" type="button" onClick={publishChanges} disabled={saving}>Publicar cambios</button>
      </article>

      <article className="card space-y-2">
        <h2 className="text-lg font-semibold">Historial de versiones mínimas</h2>
        {history.length === 0 ? <p className="text-sm text-slate-600">No hay historial todavía.</p> : null}
        {history.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 p-2 text-sm">
            <p>{new Date(item.createdAt).toLocaleString()} · {item.action} · {item.actorEmail ?? 'sin usuario'}</p>
            <button className="btn-outline" type="button" onClick={() => revertByAudit(item.id)} disabled={saving}>Revertir</button>
          </div>
        ))}
      </article>
    </section>
  );
}
