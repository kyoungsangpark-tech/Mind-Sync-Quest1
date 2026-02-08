
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MBTIState, Situation, QuestResult, UserHistory, FeedbackScore, User } from './types';
import { MOOD_CATEGORIES } from './constants';
import { getHybridQuest, markQuestAsCompleted } from './services/questService';
import MBTISelector from './components/MBTISelector';
import SituationSelector from './components/SituationSelector';
import QuestCard from './components/QuestCard';
import MindGarden from './components/MindGarden';
import LoginOverlay from './components/LoginOverlay';
import AdminDashboard from './components/AdminDashboard';
import AdSenseSlot from './components/AdSenseSlot';
import { Brain, Sparkles, ChevronLeft, ChevronRight, CheckCircle, RefreshCcw, Loader2, ThumbsUp, ThumbsDown, Minus, Flower, LogOut, Database, Lightbulb } from 'lucide-react';

type Step = 'mbti' | 'situation' | 'mood' | 'loading' | 'result' | 'feedback' | 'success' | 'garden' | 'admin';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('mbti');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mind_sync_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [mbti, setMbti] = useState<MBTIState>(() => {
    const saved = localStorage.getItem('mind_sync_mbti');
    return saved ? JSON.parse(saved) : { E: true, S: true, T: true, J: true };
  });
  const [situation, setSituation] = useState<Situation>('home');
  const [selectedMoodId, setSelectedMoodId] = useState<string>('');
  const [selectedMoodLabel, setSelectedMoodLabel] = useState<string>('');
  const [quest, setQuest] = useState<QuestResult | null>(null);
  const [history, setHistory] = useState<UserHistory[]>(() => {
    const saved = localStorage.getItem('mind_sync_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // MindGarden의 '데이터 분석 센터' 버튼 대응 리스너
  useEffect(() => {
    const handleNavAdmin = () => {
      if (user?.role === 'admin') {
        setStep('admin');
      }
    };
    window.addEventListener('nav-admin', handleNavAdmin);
    return () => window.removeEventListener('nav-admin', handleNavAdmin);
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mind_sync_mbti', JSON.stringify(mbti));
  }, [mbti]);

  useEffect(() => {
    localStorage.setItem('mind_sync_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mind_sync_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mind_sync_user');
    }
  }, [user]);

  // Admin Guard
  useEffect(() => {
    if (step === 'admin' && (!user || user.role !== 'admin')) {
      setStep('mbti');
    }
  }, [step, user]);

  const activeCategory = useMemo(() => {
    return MOOD_CATEGORIES.find(cat => cat.moods.some(m => m.label === selectedMoodLabel));
  }, [selectedMoodLabel]);

  const timeGreeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "오늘 하루를 활기차게 열어볼까요? ☀️";
    if (hour >= 12 && hour < 18) return "나른한 오후, 잠시 환기가 필요하시군요? ☕";
    if (hour >= 18 && hour < 22) return "오늘 하루도 고생 많으셨어요. 차분하게 마무리해봐요. 🌙";
    return "조용한 밤, 깊은 휴식을 위한 시간을 가져볼까요? ✨";
  }, [currentTime]);

  const handleNext = () => {
    if (step === 'mbti') setStep('situation');
    else if (step === 'situation') setStep('mood');
    else if (step === 'mood' && selectedMoodLabel) startGeneration();
  };

  const startGeneration = async () => {
    if (!activeCategory) return;
    setStep('loading');
    const result = await getHybridQuest(
      mbti, 
      situation, 
      selectedMoodLabel, 
      selectedMoodId,
      activeCategory.id, 
      history
    );
    setQuest(result);
    setStep('result');
  };

  const handleFeedback = (score: FeedbackScore) => {
    if (quest) {
      const newHistory: UserHistory[] = [{
        questTitle: quest.title,
        score,
        timestamp: Date.now(),
        moodCategory: activeCategory?.id,
        moodLabel: selectedMoodLabel,
        questType: quest.questType,
        questId: quest.id
      }, ...history].slice(0, 50); 
      setHistory(newHistory);
      markQuestAsCompleted(quest.id);
    }
    setStep('success');
  };

  const handleGardenAccess = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      setStep('garden');
    }
  };

  const handleAdminAccess = () => {
    if (!user) {
      setShowLogin(true);
    } else if (user.role === 'admin') {
      setStep('admin');
    } else {
      alert('관리자 권한이 없습니다.');
    }
  };

  const reset = () => {
    setStep('mbti');
    setQuest(null);
    setSelectedMoodLabel('');
    setSelectedMoodId('');
  };

  const steps: Step[] = ['mbti', 'situation', 'mood'];
  const currentIndex = steps.indexOf(step as any);

  return (
    <motion.div 
      animate={{ 
        background: activeCategory 
          ? `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))` 
          : 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)'
      }}
      className={`min-h-screen flex flex-col items-center p-6 sm:p-12 transition-all duration-700 ease-in-out ${activeCategory ? activeCategory.themeGradient : 'from-slate-50 to-slate-100'}`}
    >
      <header className="max-w-xl w-full flex flex-col items-center mb-10">
        <div className="w-full flex justify-between items-center mb-4">
           <button onClick={handleGardenAccess} className="p-3 bg-white/50 backdrop-blur-md rounded-2xl text-indigo-600 shadow-sm border border-white hover:bg-white transition-all flex items-center gap-2">
             <Flower size={20} />
             <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">My Garden</span>
           </button>
           
           <motion.div 
            layout 
            onClick={() => { if(user && user.role === 'admin') setStep('admin'); }} 
            className={`flex items-center gap-2 group ${user?.role === 'admin' ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Brain size={28} />
            </div>
            <h1 className="text-2xl font-bold font-outfit text-slate-800 tracking-tight">Mind-Sync Quest</h1>
          </motion.div>

          {user ? (
            <div className="flex gap-2">
               {user.role === 'admin' && (
                 <button onClick={handleAdminAccess} className="p-3 bg-slate-900 text-slate-100 rounded-2xl shadow-sm hover:bg-slate-800 transition-all">
                  <Database size={20} />
                </button>
               )}
              <button onClick={() => { if(confirm('로그아웃 하시겠습니까?')) setUser(null); }} className="p-3 bg-white/50 backdrop-blur-md rounded-2xl text-slate-400 shadow-sm border border-white hover:text-rose-500 transition-all">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="w-10 sm:w-12"></div>
          )}
        </div>
        <p className="text-slate-500 text-center text-sm font-medium">
          {user ? `${user.name}님, ` : ''}{timeGreeting}
        </p>
      </header>

      <main className="w-full max-w-xl flex-grow flex flex-col items-center pb-32">
        <AnimatePresence mode="wait">
          {step === 'admin' && user?.role === 'admin' && (
            <AdminDashboard 
              key="admin"
              user={user}
              history={history}
              onBack={() => setStep('garden')}
            />
          )}
          {step === 'garden' && <MindGarden userRole={user?.role} history={history} onBack={() => setStep('mbti')} />}
          {step === 'mbti' && (
            <motion.div key="mbti" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full flex flex-col items-center">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-800 font-outfit">성향 동기화</h2>
                <p className="text-slate-400 text-sm">AI가 당신의 성향을 학습할 준비를 마쳤습니다.</p>
              </div>
              <MBTISelector mbti={mbti} setMbti={setMbti} />
            </motion.div>
          )}
          {step === 'situation' && (
            <motion.div key="situation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full flex flex-col items-center">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-800 font-outfit">공간 동기화</h2>
                <p className="text-slate-400 text-sm">지금 이 장소에서 가능한 가장 최선의 행동을 찾아드려요.</p>
              </div>
              <SituationSelector selected={situation} setSelected={setSituation} />
            </motion.div>
          )}
          {step === 'mood' && (
            <motion.div key="mood" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full flex flex-col items-center gap-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 font-outfit">감정 동기화</h2>
                <p className="text-slate-400 text-sm">현재 당신의 주파수는 어떤가요?</p>
              </div>
              <div className="space-y-6 w-full">
                {MOOD_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-lg bg-white shadow-sm w-8 h-8 flex items-center justify-center rounded-lg">{cat.emoji}</span>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{cat.title}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {cat.moods.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => { setSelectedMoodLabel(m.label); setSelectedMoodId(m.id); }}
                          className={`px-4 py-4 rounded-2xl border-2 transition-all text-sm font-bold text-center ${
                            selectedMoodLabel === m.label
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg ring-4 ring-indigo-100'
                              : `${cat.color} ${cat.hoverColor} border-transparent shadow-sm`
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-between min-h-[60vh] py-10 w-full">
              <div className="flex flex-col items-center mt-10">
                <div className="relative mb-12">
                  <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-2 -right-2 text-yellow-400">
                    <Sparkles size={32} />
                  </motion.div>
                </div>
                <p className="text-xl font-bold text-slate-700 animate-pulse font-outfit text-center">초정밀 맥락 분석 중...</p>
              </div>
              
              <div className="w-full max-w-sm space-y-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-white/40 rounded-2xl border border-white shadow-sm">
                  <Lightbulb size={18} className="text-yellow-500" />
                  <p className="text-[11px] text-slate-500 font-medium">분석 대기 중 잠시 숨을 고르며 마음의 안정을 찾아보세요.</p>
                </div>
                <AdSenseSlot type="box" className="mx-auto" />
              </div>
            </motion.div>
          )}
          {step === 'result' && quest && <QuestCard quest={quest} onComplete={() => setStep('feedback')} />}
          {step === 'feedback' && (
            <motion.div key="feedback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm flex flex-col items-center text-center p-8 bg-white rounded-[2.5rem] shadow-xl">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-6">
                <Sparkles size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2 font-outfit">이 퀘스트가 도움이 되었나요?</h2>
              <p className="text-slate-400 text-sm mb-8">당신의 피드백은 다음 퀘스트를 더 완벽하게 만듭니다.</p>
              <div className="flex gap-4 w-full">
                <button onClick={() => handleFeedback('negative')} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 hover:bg-rose-50 hover:border-rose-200 transition-all group">
                  <ThumbsDown className="text-slate-300 group-hover:text-rose-500 transition-colors" size={24} />
                  <span className="text-[10px] font-bold text-slate-400">별로예요</span>
                </button>
                <button onClick={() => handleFeedback('neutral')} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition-all group">
                  <Minus className="text-slate-300 group-hover:text-slate-500 transition-colors" size={24} />
                  <span className="text-[10px] font-bold text-slate-400">보통이에요</span>
                </button>
                <button onClick={() => handleFeedback('positive')} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all group">
                  <ThumbsUp className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={24} />
                  <span className="text-[10px] font-bold text-slate-400">좋았어요!</span>
                </button>
              </div>
            </motion.div>
          )}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center pt-10 text-center w-full">
              <motion.div initial={{ rotate: -10, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100">
                <CheckCircle size={56} />
              </motion.div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4 font-outfit">학습 및 동기화 완료!</h2>
              <p className="text-slate-500 mb-10 max-w-sm leading-relaxed">당신의 취향을 데이터베이스에 반영했습니다.<br/>다음엔 더 마음에 쏙 드는 처방을 준비할게요.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-12">
                <button onClick={reset} className="group flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95">
                  <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" /> 다시 시작하기
                </button>
                <button onClick={handleGardenAccess} className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold shadow-lg border border-indigo-100 hover:bg-indigo-50 transition-all">
                  <Flower size={20} /> 나의 정원 보기
                </button>
              </div>

              <AdSenseSlot type="minimal" className="max-w-sm" />
              <p className="mt-4 text-slate-300 text-[9px] font-medium tracking-tighter">Powered by Mind-Sync Insight Engine</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showLogin && (
          <LoginOverlay 
            onLogin={(newUser) => { setUser(newUser); setShowLogin(false); setStep('garden'); }} 
            onClose={() => setShowLogin(false)} 
          />
        )}
      </AnimatePresence>

      {(currentIndex !== -1 && step !== 'loading' && step !== 'garden' && step !== 'admin' && !showLogin) && (
        <footer className="max-w-xl w-full flex items-center justify-between mt-auto bg-white/90 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/50 fixed bottom-8 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="flex gap-2 ml-4">
            {steps.map((s, idx) => (
              <div key={s} className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-10 bg-indigo-600' : idx < currentIndex ? 'w-4 bg-indigo-300' : 'w-4 bg-slate-200'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            {currentIndex > 0 && (
              <button onClick={() => { if (step === 'situation') setStep('mbti'); else if (step === 'mood') setStep('situation'); }} className="p-4 rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                <ChevronLeft size={24} />
              </button>
            )}
            <button onClick={handleNext} disabled={step === 'mood' && !selectedMoodLabel} className={`flex items-center gap-2 px-8 py-4 font-bold rounded-2xl transition-all ${(step === 'mood' && !selectedMoodLabel) ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : `${activeCategory?.accentColor || 'bg-indigo-600'} text-white shadow-lg active:scale-95`}`}>
              <span className="font-outfit">{currentIndex === steps.length - 1 ? 'Unlock Quest' : 'Continue'}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </footer>
      )}
    </motion.div>
  );
};

export default App;
