# DESIGN.md — Metronic 8 (demo8) Design Rules

This project uses the **Metronic 8 React theme (demo8 layout)** on Bootstrap 5.
Every page and component must look like it shipped with Metronic. When in doubt,
copy markup from an existing page in this repo (`user-management` is the reference
implementation) or from the Metronic docs: https://preview.keenthemes.com/metronic8/react/docs

## 1. Hard rules (never break these)

1. **Only Metronic / Bootstrap 5 utility classes.** No Tailwind, MUI, Ant Design,
   Chakra, styled-components, CSS-in-JS, or new UI libraries.
2. **No inline styles** (`style={{...}}`) for colors, spacing, fonts, borders or
   shadows. Use classes (`mb-7`, `fs-6`, `text-gray-800`, `bg-light-primary`, …).
   Inline style is only allowed for truly dynamic values (e.g. a progress-bar width, a
   background-image URL).
3. **No hard-coded colors** (`#1B84FF`, `red`, `rgb(...)`). Use the theme color names:
   `primary`, `secondary`, `success`, `info`, `warning`, `danger`, `light`, `dark`,
   and the gray scale `gray-100` … `gray-900`.
   In TS, read a theme color with `getCSSVariableValue('--bs-primary')`.
4. **Never edit `src/_metronic/assets/sass/**`** (theme core). Change theme variables
   only if explicitly asked. If a custom style is truly unavoidable, put it in
   `src/app/styles/custom.scss` using theme CSS variables (`var(--bs-...)`), and keep it tiny.
5. **Don't touch the layout shell** (`src/_metronic/layout/**`) except to add menu
   items in `AsideMenuMain.tsx`.
6. **Icons = Keenicons via `<KTIcon iconName="..." />`.** Don't add other icon packs.
   Browse names in `src/_metronic/helpers/icons-config/icons.ts`.
7. **Font = Inter** (loaded in `index.html`). Don't add fonts.
8. Text sizes use `fs-1` … `fs-9` / `fs-2x` etc. Weights use `fw-semibold`, `fw-bold`,
   `fw-bolder`. Don't use `<h1>` default sizes without Metronic classes.

## 2. Light / Dark mode

The app supports **Light, Dark and System** modes (toggle at the top-right of the header,
`ThemeModeSwitcher`). The mode is stored in localStorage (`kt_theme_mode_value`) and is
applied before React mounts by the inline script in `index.html`.

- Every screen must look correct in **both** modes. Check both before finishing.
- Use theme-aware classes: `text-gray-900` (headings), `text-gray-600/700` (body),
  `text-muted`, `bg-body`, `bg-light`, `bg-light-primary`, `border-gray-200`, `card`.
  These flip automatically in dark mode.
- Don't use `text-white`, `text-dark`, `bg-white`, `bg-dark`, `bg-secondary` for surfaces/text
  (they don't flip). `text-white` is fine only on top of a solid color (`btn-primary`, a
  `bg-primary` banner, an image).
- Need a value in inline style/JS? Use CSS variables: `var(--bs-body-bg)`, `var(--bs-gray-600)`,
  `getCSSVariableValue('--bs-primary')`.
- Images that need a dark variant: render both with `theme-light-show` / `theme-dark-show`.
- In code: `const {mode} = useThemeMode()` (from `_metronic/partials`).
- **Sidebar follows the mode**: light in Light mode, dark in Dark mode. The light override lives
  in `src/app/styles/custom.scss`; don't add `bg-*` classes or inline colors to the aside.
- SweetAlert2: always `buttonsStyling: false` + `customClass` with `btn` classes, so dialogs
  follow the theme.

## 3. Page skeleton

Every private page is rendered inside `MasterLayout` (aside + header + content).
A page sets its title with `PageTitle` and renders cards:

```tsx
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {KTCard, KTCardBody} from '../../../_metronic/helpers'

const breadcrumbs: Array<PageLink> = [
  {title: 'Products', path: '/products/list', isSeparator: false, isActive: false},
  {title: '', path: '', isSeparator: true, isActive: false},
]

const ProductsPage = () => (
  <>
    <PageTitle breadcrumbs={breadcrumbs}>Products list</PageTitle>
    <KTCard>
      <div className="card-header border-0 pt-6">
        <div className="card-title">{/* search */}</div>
        <div className="card-toolbar">{/* filter + primary button */}</div>
      </div>
      <KTCardBody className="py-4">{/* table / content */}</KTCardBody>
    </KTCard>
  </>
)
```

Grid: `row g-5 g-xl-8` → `col-xl-4`, `col-xl-6`, `col-xl-12`, …

## 4. Components cheat-sheet

### Card
```html
<div class="card card-flush">            <!-- or <KTCard> -->
  <div class="card-header">
    <h3 class="card-title fw-bolder text-gray-900">Title</h3>
    <div class="card-toolbar">…</div>
  </div>
  <div class="card-body">…</div>
</div>
```

### Buttons
| Purpose | Classes |
|---|---|
| Primary action | `btn btn-primary` |
| Secondary action (Filter, Export) | `btn btn-light-primary` |
| Cancel / Discard | `btn btn-light` |
| Row "Actions" dropdown | `btn btn-light btn-active-light-primary btn-sm` |
| Destructive | `btn btn-danger` (or `btn-light-danger`) |
| Icon only | `btn btn-icon btn-sm btn-active-icon-primary` |

Button with icon: `<button className="btn btn-primary"><KTIcon iconName="plus" className="fs-2" />Add User</button>`

Loading state inside a button:
```tsx
{!loading && <span className="indicator-label">Submit</span>}
{loading && (
  <span className="indicator-progress" style={{display: 'block'}}>
    Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
  </span>
)}
```

### Forms
```tsx
<div className="fv-row mb-7">
  <label className="required fw-bold fs-6 mb-2">Name</label>
  <input
    {...formik.getFieldProps('name')}
    className={clsx('form-control form-control-solid mb-3 mb-lg-0',
      {'is-invalid': formik.touched.name && formik.errors.name},
      {'is-valid': formik.touched.name && !formik.errors.name})}
  />
  {formik.touched.name && formik.errors.name && (
    <div className="fv-plugins-message-container">
      <div className="fv-help-block"><span role="alert">{formik.errors.name}</span></div>
    </div>
  )}
</div>
```
- Forms use **Formik + Yup**.
- Inputs inside the app: `form-control form-control-solid`; selects: `form-select form-select-solid`.
- On the auth (login) page inputs are `form-control bg-transparent`.
- Checkbox / radio: `form-check form-check-custom form-check-solid` + `form-check-input`.
- Form-level error: `<div className="alert alert-danger">…</div>`.

### Tables (list pages)
- Use `react-table` like `user-management/users-list`.
- `<table className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">`
- Head row: `text-start text-muted fw-bolder fs-7 text-uppercase gs-0`
- Body: `text-gray-600 fw-bold`
- Empty: a single row with `No matching records found` centered.
- Wrap in `<div className="table-responsive">`.

### Badges / status
`badge badge-light-success` (active / ok), `badge-light-warning` (pending),
`badge-light-danger` (error / inactive), `badge-light-primary` (info / role).

### Avatars / symbols
```html
<div class="symbol symbol-circle symbol-50px">
  <div class="symbol-label fs-3 bg-light-primary text-primary">A</div>
</div>
```

### Dropdown menu (row actions, filters)
```tsx
<a href="#" className="btn btn-light btn-active-light-primary btn-sm"
   data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
  Actions <KTIcon iconName="down" className="fs-5 m-0" />
</a>
<div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4" data-kt-menu="true">
  <div className="menu-item px-3"><a className="menu-link px-3">Edit</a></div>
</div>
```
Call `MenuComponent.reinitialization()` in a `useEffect` after rendering dropdowns.

### Modal
Follow `user-edit-modal/UserEditModal.tsx`:
`modal fade show d-block` → `modal-dialog modal-dialog-centered mw-650px` → `modal-content`
→ `modal-header` (`<h2 className="fw-bolder">`) + close `btn btn-icon btn-sm btn-active-icon-primary`
→ `modal-body scroll-y mx-5 mx-xl-15 my-7`, plus `<div className="modal-backdrop fade show" />`.
Footer actions: `text-center pt-15` with `btn btn-light me-3` (Discard) + `btn btn-primary` (Submit).

### Confirm / toast dialogs
Use **SweetAlert2** (already styled by the theme):
```ts
Swal.fire({icon: 'warning', text: 'Delete this item?', showCancelButton: true,
  confirmButtonText: 'Yes, delete', buttonsStyling: false,
  customClass: {confirmButton: 'btn btn-danger', cancelButton: 'btn btn-light'}})
```

### Loading overlay for a card/table
Reuse the `UsersListLoading` pattern ("Processing..." box) or
`<span className="spinner-border spinner-border-sm" />`.

### Charts
If a chart is needed use **ApexCharts** (`react-apexcharts`), colors from
`getCSSVariableValue('--bs-primary')` etc. — never hard-coded hex.

## 5. Sidebar menu

Add items only in `src/_metronic/layout/components/aside/AsideMenuMain.tsx`:
```tsx
<AsideMenuItem to="/products" icon="basket" title="Products" />

<AsideMenuItemWithSub to="/reports" title="Reports" icon="chart-simple">
  <AsideMenuItem to="/reports/daily" title="Daily" hasBullet />
</AsideMenuItemWithSub>
```
Section header:
```tsx
<div className="menu-item"><div className="menu-content pt-8 pb-2">
  <span className="menu-section text-muted text-uppercase fs-8 ls-1">Section</span>
</div></div>
```

## 6. Review checklist (before finishing any UI task)

- [ ] No inline colors/spacing, no hex codes, no new CSS files or libraries
- [ ] Icons via `KTIcon`
- [ ] Page uses `PageTitle` + card layout
- [ ] Forms use `fv-row`, `form-control-solid`, Formik/Yup validation messages
- [ ] Buttons follow the button table above
- [ ] Checked in **Light and Dark** mode (no white boxes in dark, no unreadable text)
- [ ] Looks right at mobile width (aside becomes a drawer; tables are `table-responsive`)
