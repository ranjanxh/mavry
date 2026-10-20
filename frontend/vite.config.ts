import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `vite build --mode preview` produces one self-contained HTML file (hash routing)
// that can be hosted anywhere without server-side route fallbacks.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'preview' ? [viteSingleFile()] : [])],
  base: mode === 'preview' ? './' : '/',
}));
