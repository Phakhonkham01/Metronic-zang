/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_USE_MOCK_API: string
  readonly VITE_APP_THEME_NAME: string
  readonly VITE_APP_BASE_LAYOUT_CONFIG_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
