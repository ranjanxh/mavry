/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HASH_ROUTER?: string;
  /** "false" switches services from sample data to the HTTP client. Default: mocks on. */
  readonly VITE_USE_MOCKS?: string;
  /** Backend base URL, used only when mocks are off. */
  readonly VITE_API_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
