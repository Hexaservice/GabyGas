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

## Configuración de base de datos

1. Copia variables de entorno:

```bash
cp .env.example .env
```

2. Configura `DATABASE_URL` apuntando a tu instancia PostgreSQL.

3. Genera el cliente Prisma y ejecuta migraciones:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Carga datos iniciales de servicios, zonas y configuración global:

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
