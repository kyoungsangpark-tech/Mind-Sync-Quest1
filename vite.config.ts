import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 현재 작업 디렉토리에서 환경 변수를 로드합니다. (Vite는 기본적으로 VITE_ 접두사가 붙은 것만 로드하지만, 세 번째 인자를 ''로 주면 모든 변수를 로드합니다.)
  // Fix: Access cwd via cast to any to avoid TypeScript error on the global process object when @types/node is missing or misconfigured.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Vercel, 로컬 .env 등에서 설정될 수 있는 다양한 변수명을 체크합니다.
  const GEMINI_API_KEY = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || env.API_KEY || env.REACT_APP_GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // 가이드라인 준수: 코드 내의 'process.env.API_KEY'를 실제 키값으로 강제 치환합니다.
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
