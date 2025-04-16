/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta" />

interface ImportMetaEnv {
  readonly VITE_STRAPI_API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}