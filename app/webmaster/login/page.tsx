import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { WebmasterLoginForm } from '@/components/WebmasterLoginForm';
import { authOptions } from '@/lib/auth/options';

type Props = {
  searchParams?: {
    callbackUrl?: string;
  };
};

export default async function WebmasterLoginPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect('/webmaster');
  }

  const callbackUrl = searchParams?.callbackUrl ?? '/webmaster';

  return (
    <section className="mx-auto max-w-md space-y-4">
      <h1 className="h1 text-center">Webmaster Login</h1>
      <p className="text-center text-sm text-muted-foreground">
        Acceso restringido a roles administrativos. Protección CSRF gestionada por Auth.js.
      </p>
      <WebmasterLoginForm callbackUrl={callbackUrl} />
    </section>
  );
}
