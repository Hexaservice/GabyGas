'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

type Props = {
  callbackUrl: string;
};

export function WebmasterLoginForm({ callbackUrl }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      if (result.error.startsWith('RATE_LIMIT:')) {
        const retryAfter = Number(result.error.replace('RATE_LIMIT:', ''));
        const minutes = Math.ceil(retryAfter / 60);
        setError(`Demasiados intentos. Intenta de nuevo en ${minutes} minuto(s).`);
      } else {
        setError('Credenciales inválidas o sin permisos para acceder al panel webmaster.');
      }
      setIsLoading(false);
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
      return;
    }

    setIsLoading(false);
  }

  return (
    <form className="card space-y-3" onSubmit={handleSubmit}>
      <label className="block space-y-1 text-sm">
        <span>Correo</span>
        <input className="field" type="email" name="email" placeholder="admin@gabygas.com" required />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Contraseña</span>
        <input className="field" type="password" name="password" placeholder="••••••••" required />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="btn-primary w-full" disabled={isLoading}>
        {isLoading ? 'Validando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
