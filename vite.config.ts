import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api로 시작하는 요청을 실제 백엔드 서버로 우회
      "/api": {
        target: process.env.VITE_API_BASE_URL, // 백엔드 실제 주소
        changeOrigin: true, // 호스트 헤더를 target으로 변경
      },
    },
  },
});