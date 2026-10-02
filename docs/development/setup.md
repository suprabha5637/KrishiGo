# KrishiGo — Development & Code Standards

## Codebase Principles

1. **Strict Type Safety**: All TypeScript files must pass `tsc -b` with zero compilation errors. Avoid `any` types where domain interfaces exist in `src/types/index.ts`.
2. **Path Aliasing**: Always import modules using the configured `@/*` alias (e.g. `import { apiClient } from '@/lib/apiClient'`) to maintain relocatable imports.
3. **Domain Segregation**: Keep E-Commerce features isolated in `src/components/ecommerce/` and `src/pages/krishigo/`. Keep Farmer features isolated in `src/components/farmer/` and `src/pages/farmer/`. Shared UI utilities belong strictly in `src/components/common/`.
4. **No Direct External Calls in UI**: UI components must use domain services (`src/services/ecommerce/`, `src/services/farmer/`) rather than ad-hoc `fetch` invocations.
5. **No Secrets in Frontend**: Never commit API keys or private credentials into frontend files. Sensitive keys belong strictly in backend `.env`.

---

## Git Workflow

- Main branch: `main` (production-ready)
- Feature branches: `feat/<feature-name>`
- Bugfix branches: `fix/<issue-description>`
- Commit message format: Follow Conventional Commits:
  - `feat(ecommerce): connect bottom product grids to api`
  - `fix(build): resolve tsconfig alias for ts 6.0`
  - `docs(architecture): add complete backend system guide`
