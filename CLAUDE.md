# CLAUDE.md

Starter frontend built on the **Metronic 8 React theme (demo8)**, React 18 + TypeScript + Vite.
It only contains: **Login**, **Dashboard** (blank) and **User Management** (CRUD).
New features are built on top of this skeleton.

**All UI work must follow [DESIGN.md](DESIGN.md).** Read it before writing any JSX.
The goal is that the app always looks like stock Metronic — no visual drift.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc + vite build — must pass before a task is done
npm run lint
```

## Login

`VITE_USE_MOCK_API=true` (default in `.env`) runs without a backend.
Mock data lives in browser localStorage (`mock-users-db`). Default account:

- username: `test`
- password: `123456`
- role: `admin`

Set `VITE_USE_MOCK_API=false` and `VITE_API_URL=...` to use a real backend.

## Structure

```
src/
  main.tsx                         providers (react-query, i18n, auth) + styles
  services/
    api.ts                         axios instance + authAPI + userAPI (the ONLY place that calls HTTP)
    types.ts                       shared API types (AuthUser, User, LoginResponse)
    mock/mockApi.ts                localStorage mock with the same interface as api.ts
  app/
    routing/AppRoutes.tsx          public vs private routes (by currentUser)
    routing/PrivateRoutes.tsx      pages inside MasterLayout; admin-only routes guarded here
    modules/auth/                  Login page, AuthProvider/useAuth, AuthInit (token check on load)
    modules/apps/user-management/  reference CRUD module (list, search, filter, modal form)
    modules/errors/                404 / 500
    pages/dashboard/               Dashboard
  _metronic/                       THEME CORE — layout, helpers, sass. Don't modify (see below)
```

## Backend contract (expected by `services/api.ts`)

| Method | Endpoint | Body / Response |
|---|---|---|
| POST | `/auth/login` | `{username, password}` → `{token, user}` |
| GET | `/auth/me` | → `{data: AuthUser}` |
| GET | `/users?page=&items_per_page=&search=&sort=&order=&filter_role=` | → `{data: User[], payload?: {pagination}}` |
| GET | `/users/:id` | → `{data: User}` |
| POST | `/users` | `User` → `{data: User}` |
| PUT | `/users/:id` | `User` → `{data: User}` |
| DELETE | `/users/:id` | — |

Auth header: `Authorization: Bearer <token>`. A 401 response clears the session and redirects to `/auth/login`.

## Conventions

- **HTTP**: add new endpoints as a new `xxxAPI` object in `services/api.ts` (and a matching mock in
  `mock/mockApi.ts` if mock mode should keep working). Components never call `axios` directly.
- **Types**: API types go in `services/types.ts`.
- **New module**: copy the shape of `modules/apps/user-management/`
  (`XxxPage.tsx` with nested routes → `xxx-list/` with `core/`, `table/`, `components/`, `edit-modal/`).
  Register it lazily in `PrivateRoutes.tsx` with `SuspensedView`, and add a menu item in
  `src/_metronic/layout/components/aside/AsideMenuMain.tsx`.
- **Auth**: `const {currentUser, logout} = useAuth()`; role check is `currentUser?.role === 'admin'`.
  Guard admin pages both in the menu and in `PrivateRoutes`.
- **Server state**: react-query (`useQuery` / `useMutation`). Forms: Formik + Yup.
  Dialogs: SweetAlert2.
- Keep the code style of the surrounding files; don't leave `console.log` debugging in commits.

## Do not

- Edit `src/_metronic/assets/sass/**` or restyle the layout shell.
- Add UI/CSS libraries (Tailwind, MUI, antd, bootstrap themes, icon packs, fonts).
- Use inline styles or hex colors for design (see DESIGN.md §1).
- Hard-code API URLs — use `VITE_API_URL` via `services/api.ts`.
