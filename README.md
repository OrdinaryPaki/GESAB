# GESAB Hemsida

Next.js-projekt med React och Tailwind.

Direkta paket är pinnade till versioner som fanns tillgängliga senast 16 juni 2026:

- `next`: `16.2.9`
- `react`: `19.2.7`
- `react-dom`: `19.2.7`
- `tailwindcss`: `4.3.1`
- `@tailwindcss/postcss`: `4.3.1`

`.npmrc` använder `before=2026-06-17T00:00:00.000Z` så `npm install` inte väljer paketversioner publicerade efter gränsdatumet.

Projektet använder också en npm override för Nexts interna `postcss`, eftersom `next@16.2.9` annars installerar `postcss@8.4.31`, som npm audit flaggar. Overriden använder `postcss@8.5.15`, publicerad före gränsdatumet och utanför den sårbara versionserien.

## Kommandon

```bash
npm install
npm run dev
npm run build
```
