# Opsphere Console

![CI](https://github.com/pGabrielM/opsphere-console/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-4-646CFF?style=flat-square)

Frontend for [Opsphere API](https://github.com/pGabrielM/opsphere-api): a token-authenticated
console where a team signs in and reaches gated dashboards/resources for their operations
workspace.

## Architecture

- **`AuthContext`/`AuthProvider`** (`src/contexts/Auth`) hold the JWT and the authenticated
  user in memory, exposing `login`/`logout` to the rest of the app.
- **`RequireAuth`** is a route guard: it validates the stored token against
  `GET /profile` on the API before rendering a protected route, redirecting to `/login`
  otherwise.
- **`useApi`** (`src/hooks/useApi.ts`) is a small typed wrapper around `axios`, the only place
  that knows the API's base URL and endpoints.
- Routing is a flat `react-router-dom` v6 tree (`src/routes/RoutesApp.tsx`): `/login` (public),
  `/home` and `/private` (behind `RequireAuth`).

## Running locally

```bash
cp .env.example .env   # point VITE_API_URL at your opsphere-api instance
npm install
npm run dev
```

## CI

Every push/PR to `main` type-checks and builds the app via
[GitHub Actions](.github/workflows/ci.yml).

## Stack

React 18, TypeScript, Vite, React Router, Axios, Stitches.
