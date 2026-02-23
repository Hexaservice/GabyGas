import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export default async function WebmasterHomePage() {
  const session = await getServerSession(authOptions);

  return (
    <section className="space-y-3">
      <h1 className="h1">Panel Webmaster</h1>
      <p className="text-sm text-muted-foreground">
        Sesión activa como <strong>{session?.user?.name ?? session?.user?.email}</strong> ({session?.user?.role}).
      </p>
      <p className="text-sm">Las rutas bajo /webmaster están protegidas por middleware y control de rol.</p>
    </section>
  );
}
