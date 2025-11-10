/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Add other env variables here if needed
  // readonly VITE_SOME_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}