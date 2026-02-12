import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 모든 접두사 환경변수를 로드하여 process.env.API_KEY에 주입
  const env = loadEnv(mode, process.cwd(), '');
  
  const GEMINI_API_KEY = env.API_KEY || env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // 가이드라인 준수: 코드 내의 'process.env.API_KEY'를 실제 키값으로 강제 치환
      'process.env.API_KEY': JSON.stringify(GEMINI_API_KEY),
    },
    build: {
      outDir: 'dist',
    },
    server: {
      port: 5173
    }
  };
});