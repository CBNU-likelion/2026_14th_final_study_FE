import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://3.39.231.178:8080', 
          changeOrigin: true, 
        } ,
      },
    },
});