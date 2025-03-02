import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For Netlify deployments, we always want to use '/' as the base path
const base = '/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
