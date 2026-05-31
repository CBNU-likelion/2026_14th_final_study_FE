import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.BACKEND_URL,
          changeOrigin: true,
          secure: false, // TODO: 백엔드 주소가 https인 경우 삭제 확인
        },
      },
    },
  };
});
