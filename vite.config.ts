import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api로 시작하는 요청을 실제 백엔드 서버로 우회
      "/api": {
        target: "https://202614thfinalstudybe-production-0389.up.railway.app",
        changeOrigin: true,
      },
    },
  },
});