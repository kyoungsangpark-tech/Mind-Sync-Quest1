
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel에서 설정한 API_KEY 환경 변수를 클라이언트 코드의 process.env.API_KEY로 치환합니다.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173
  }
});
