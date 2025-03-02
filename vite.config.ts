import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Check if we're deploying to Netlify
const isNetlify = process.env.NETLIFY === 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use '/' as base for Netlify, otherwise use the GitHub Pages path for other deployments
  base: isNetlify ? '/' : (process.env.NODE_ENV === 'production' ? '/AI_ResumeBuilder/' : '/'),
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
