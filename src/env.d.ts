// src/env.d.ts (se ainda não tiver)
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CLIENT_SECRET: string;
  readonly VITE_CSRF_TOKEN: string;
  readonly VITE_DEV_MODE: string;
  // Adicione outras variáveis que você usar
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}