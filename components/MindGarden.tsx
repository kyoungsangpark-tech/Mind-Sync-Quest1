
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserHistory, MoodCategory, UserRole } from '../types';
import { MOOD_CATEGORIES } from '../constants';
import { Flower, Flame, Trophy, Calendar, ChevronLeft, Database, Settings } from 'lucide-react';

interface Props {
  history: UserHistory[];
  onBack: () => void;
  userRole?: UserRole;
}

const MindGarden: React.FC<Props> = ({ history, onBack, userRole }) => {
  const stats = useMemo(() => {
    const total = history.length;
    const dates = Array.from(new Set(history.map(h => new Date(h.timestamp).toDateString())));
    const streak = dates.length; // Simplified streak for demo
    
    let levelTitle = '씨앗 관찰자';
    let plantEmoji = '🌱';
    
    if (total >= 30) { levelTitle = '마음의 도사'; plantEmoji = '🌸'; }
    else if (total >= 15) { levelTitle = '마음 관리사'; plantEmoji = '🌳'; }
    else if (total >= 7) { levelTitle = '정원 수습생'; plantEmoji = '🪴'; }
    else if (total >= 3) { levelTitle = '새싹 탐험가'; plantEmoji = '🌿'; }

    return { total, streak, levelTitle, plantEmoji };
  }, [history]);

  const mindMap = useMemo(() => {
    const map = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayHistory = history.filter(h => new Date(h.timestamp).toDateString() === dateStr);
      const lastMood = dayHistory[0]?.moodCategory;
      
      map.push({
        date: date.getDate(),
        mood: lastMood,
      });
    }
    return map;
  }, [history]);

  const getMoodColor = (cat?: MoodCategory) => {
    if (!cat) return 'bg-slate-100';
    const config = MOOD_CATEGORIES.find(c => c.id === cat);
    return config ? config.accentColor : 'bg-indigo-400';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/50"
    >
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-slate-400" />
        </button>
        <h2 className="text-xl font-bold font-outfit text-slate-800">🪴 나의 마음 정원</h2>
        <div className="w-10"></div>
      </div>

      {/* Hero: Plant Growth */}
      <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-b from-indigo-50/50 to-transparent rounded-[2rem] mb-8">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-8xl mb-4 drop-shadow-2xl"
        >
          {stats.plantEmoji}
        </motion.div>
        <div className="text-center">
          <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-2 inline-block">
            LV. {Math.floor(stats.total / 5) + 1} {stats.levelTitle}
          </span>
          <p className="text-slate-400 text-sm">지금까지 {stats.total}번의 마음을 동기화했습니다.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">연속 수행</p>
            <p className="text-xl font-bold text-slate-800">{stats.streak}일</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">총 완료</p>
            <p className="text-xl font-bold text-slate-800">{stats.total}회</p>
          </div>
        </div>
      </div>

      {/* Mind Map */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-600">마음 지도 (최근 14일)</h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {mindMap.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div 
                className={`w-full aspect-square rounded-lg shadow-sm transition-all duration-500 ${getMoodColor(day.mood)}`}
              />
              <span className="text-[8px] font-bold text-slate-300">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Quick Link (Condition Rendering) */}
      {userRole === 'admin' && (
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-300 uppercase font-bold tracking-widest mb-3 px-2">Management</p>
          <div className="flex gap-3">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('nav-admin'))} 
              className="flex-1 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all group"
            >
              <Database size={18} className="group-hover:text-indigo-400" />
              <span className="text-xs font-bold">데이터 분석 센터</span>
            </button>
            <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-100 transition-all">
              <Settings size={18} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MindGarden;
