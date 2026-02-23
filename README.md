# GabyGas Web

Base web con Next.js + TypeScript + App Router, Tailwind CSS y Prisma ORM sobre PostgreSQL.

## Rutas iniciales

- /
- /nosotros
- /servicios
- /tienda
- /contacto
- /buscar
- /webmaster/login
- /webmaster (protegida por sesión y rol)

## Seguridad implementada

- Autenticación con NextAuth (Auth.js) y proveedor de credenciales.
- Contraseñas hasheadas con `bcryptjs`.
- Roles para panel webmaster: `admin` y `editor`.
- Middleware de autorización para `/webmaster/*`.
- Rate limiting en login (bloqueo temporal por intentos fallidos).
- CSRF de Auth.js para rutas de autenticación.
- Cookies de sesión `HttpOnly`, `Secure` (en producción), `SameSite`.
- Expiración de sesión (8 horas) y actualización cada 30 minutos.
- Headers de seguridad (CSP, HSTS, X-Frame-Options, etc.).
- Auditoría básica de cambios críticos (teléfonos, banners, productos y precios).

## Configuración de base de datos

1. Copia variables de entorno:

```bash
cp .env.example .env
```

2. Configura `DATABASE_URL` apuntando a tu instancia PostgreSQL.

3. Define secretos y credenciales de seed:

```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-seguro"
SEED_ADMIN_PASSWORD="Admin1234!"
SEED_EDITOR_PASSWORD="Editor1234!"
```

4. Genera el cliente Prisma y ejecuta migraciones:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Carga datos iniciales de servicios, zonas y usuarios:

```bash
npm run prisma:seed
```

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
```

## SEO local implementado

- Metadata por ruta con `title`, `description`, Open Graph, Twitter Cards y canonical.
- `robots.txt` y `sitemap.xml` generados con App Router (`app/robots.ts`, `app/sitemap.ts`).
- Estrategia de keywords locales para Valle de Aburrá y landings por municipio (`/cobertura/medellin`, `/cobertura/bello`, `/cobertura/envigado`).
- Schema.org incluido: `LocalBusiness`, `Service`, `Product` y `FAQPage`.
- Integración de Google Analytics (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) y verificación Search Console (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`).
- Dashboard SEO-conversión en `/webmaster` (leads/órdenes, tasas y estado de integraciones).

### Variables de entorno SEO sugeridas

```bash
NEXT_PUBLIC_SITE_URL="https://tudominio.com"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="codigo-search-console"
```
