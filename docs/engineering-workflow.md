# Flujo de trabajo de ingeniería

## 1) Ramas por feature
- Convención obligatoria: `feature/<descripcion-corta>`.
- Ejemplos:
  - `feature/checkout-optimizado`
  - `feature/seo-local-home`
- Recomendación: crear cada rama desde `main` actualizada.

## 2) Pull Request template con checklist
Se agregó plantilla en:
- `.github/PULL_REQUEST_TEMPLATE/pull_request_template.md`

Todos los PR deben completar checklist de:
- UX
- SEO
- Seguridad
- Responsive
- Accesibilidad

## 3) Checks obligatorios de CI
Workflow en:
- `.github/workflows/ci.yml`

Gates requeridos:
- Lint (`npm run lint`)
- Type-check (`npm run type-check`)
- Build (`npm run build`)
- Pruebas clave (`npm run test:key`)

> Configurar en GitHub Branch Protection para `main` marcando este workflow como required status check.

## 4) Releases quincenales + changelog + métricas por PR
Cadencia:
- Release cada 2 semanas (jueves sugerido).

Proceso:
1. Consolidar PRs cerrados desde la release anterior.
2. Actualizar `CHANGELOG.md` con secciones por tipo de cambio.
3. Publicar tag `vYYYY.MM.N`.
4. Registrar resultados de negocio por PR (conversión, estabilidad, SEO local, velocidad) desde la sección de métricas de la plantilla PR.

## 5) Tablero de GitHub Projects
Crear un proyecto de tipo board con columnas:
- Backlog
- En progreso
- Review
- Done

Automatización sugerida:
- Issue/PR nuevo → Backlog
- PR abierto con draft removido → En progreso
- PR en revisión → Review
- PR mergeado / issue cerrado → Done
