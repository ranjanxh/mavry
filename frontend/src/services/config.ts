/** Runtime switches. Mock mode is the default so the demo runs without a backend. */
export const USE_MOCKS: boolean = import.meta.env.VITE_USE_MOCKS !== 'false';

/** Base URL of the FastAPI backend. Empty means same origin. Only used when mocks are off. */
export const API_URL: string = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
