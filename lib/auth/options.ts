import { compare } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { clearLoginAttempts, isLoginBlocked, registerFailedLogin } from '@/lib/auth/rateLimit';

function getClientIp(headers: Record<string, string | string[] | undefined>) {
  const xForwardedFor = headers['x-forwarded-for'];

  if (typeof xForwardedFor === 'string') {
    return xForwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  if (Array.isArray(xForwardedFor) && xForwardedFor.length > 0) {
    return xForwardedFor[0] ?? 'unknown';
  }

  return (typeof headers['x-real-ip'] === 'string' && headers['x-real-ip']) || 'unknown';
}

function normalizeRole(roleName: string) {
  return roleName.toLowerCase();
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 30,
  },
  pages: {
    signIn: '/webmaster/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials, req) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? '';
        const ip = getClientIp(req.headers);
        const limitKey = `${ip}:${email ?? 'unknown'}`;

        const blockStatus = isLoginBlocked(limitKey);
        if (blockStatus.blocked) {
          throw new Error(`RATE_LIMIT:${blockStatus.retryAfterSeconds}`);
        }

        if (!email || !password) {
          registerFailedLogin(limitKey);
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: { role: true },
        });

        if (!user || !user.isActive) {
          registerFailedLogin(limitKey);
          return null;
        }

        const passwordMatches = await compare(password, user.passwordHash);
        if (!passwordMatches) {
          registerFailedLogin(limitKey);
          return null;
        }

        clearLoginAttempts(limitKey);

        const role = normalizeRole(user.role.name);
        if (role !== 'admin' && role !== 'editor') {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role,
        };
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.role = typeof token.role === 'string' ? token.role : undefined;
      }

      return session;
    },
  },
};
