
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel/환경 변수에서 API_KEY를 가져와 주입 (없을 경우 빈 문자열)
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173
  }
});
