import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://54.180.114.77:8080', 
          changeOrigin: true, 
        } ,
        '/server': {
          target: 'http://54.180.114.77:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/server/, '/api'),
        },
      },
    },
});
