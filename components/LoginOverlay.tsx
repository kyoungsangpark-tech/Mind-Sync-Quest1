
import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, ShieldCheck, X } from 'lucide-react';
import { User, UserRole } from '../types';

interface Props {
  onLogin: (user: User) => void;
  onClose: () => void;
}

const ADMIN_EMAILS = ['traveler@gmail.com', 'admin@mindsync.com']; // 관리자로 지정할 이메일 목록

const LoginOverlay: React.FC<Props> = ({ onLogin, onClose }) => {
  const handleGoogleLogin = () => {
    // 실제 환경에서는 OAuth 결과에서 반환된 이메일을 체크합니다.
    const userEmail = 'traveler@gmail.com'; // 테스트용 이메일
    const role: UserRole = ADMIN_EMAILS.includes(userEmail) ? 'admin' : 'user';

    const mockUser: User = {
      id: 'google_12345',
      name: role === 'admin' ? '운영자' : '마인드 여행자',
      email: userEmail,
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky',
      joinedAt: Date.now(),
      role: role
    };
    
    setTimeout(() => {
      onLogin(mockUser);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <LogIn size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 font-outfit mb-3">정원을 가꾸려면 가입이 필요해요</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            당신의 마음 지도를 안전하게 보관하고<br/>
            변화하는 에너지를 지속적으로 추적해드릴게요.
          </p>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 transition-all active:scale-95 mb-6"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
            Google 계정으로 계속하기
          </button>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-3 text-left">
              <ShieldCheck size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                가입 시, 서비스 개선 및 맞춤형 퀘스트 제공을 위해 <strong>사용자의 심리 성향 및 활동 데이터를 수집하고 활용</strong>하는 것에 동의하게 됩니다. 수집된 정보는 더 정교한 마인드 케어를 위해서만 사용됩니다.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginOverlay;
