
import React from 'react';
import { motion } from 'framer-motion';
import { User, UserHistory } from '../types';
import { Database, Download, User as UserIcon, History, ChevronLeft, Copy, ExternalLink } from 'lucide-react';

interface Props {
  user: User | null;
  history: UserHistory[];
  onBack: () => void;
}

const AdminDashboard: React.FC<Props> = ({ user, history, onBack }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('데이터가 클립보드에 복사되었습니다.');
  };

  const downloadJSON = () => {
    const data = {
      subscriber: user,
      activity: history,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mind_sync_data_${user?.id || 'guest'}.json`;
    a.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl bg-slate-900 text-slate-100 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden border border-slate-800"
    >
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Database size={20} className="text-indigo-400" />
          <h2 className="text-xl font-bold font-outfit uppercase tracking-wider">Admin Data Center</h2>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="space-y-8">
        {/* User Profile Info */}
        <section className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <UserIcon size={18} className="text-indigo-400" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Subscriber Profile</h3>
          </div>
          
          {user ? (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Name</p>
                <p className="font-bold">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Email</p>
                <p className="font-bold text-indigo-300">{user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase">User ID</p>
                <p className="text-xs font-mono text-slate-400">{user.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Joined At</p>
                <p className="text-xs text-slate-400">{new Date(user.joinedAt).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm italic">로그인된 사용자가 없습니다.</p>
          )}
        </section>

        {/* Activity Logs */}
        <section className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <History size={18} className="text-indigo-400" />
              <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Activity Logs ({history.length})</h3>
            </div>
            <button 
              onClick={() => copyToClipboard(JSON.stringify(history, null, 2))}
              className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors"
            >
              <Copy size={12} /> COPY JSON
            </button>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-dark">
            {history.length > 0 ? history.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200">{h.questTitle}</span>
                  <span className="text-[10px] text-slate-500">{new Date(h.timestamp).toLocaleTimeString()}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  h.score === 'positive' ? 'bg-emerald-500/10 text-emerald-400' :
                  h.score === 'neutral' ? 'bg-slate-500/10 text-slate-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {h.score.toUpperCase()}
                </span>
              </div>
            )) : (
              <p className="text-slate-600 text-xs italic text-center py-4">수행된 퀘스트 기록이 아직 없습니다.</p>
            )}
          </div>
        </section>

        {/* Action Controls */}
        <div className="flex gap-4">
          <button 
            onClick={downloadJSON}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
          >
            <Download size={18} /> Export Data
          </button>
          <a 
            href="https://console.cloud.google.com/" 
            target="_blank" 
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all border border-slate-700"
          >
            <ExternalLink size={18} /> GCP Console
          </a>
        </div>

        <p className="text-center text-[10px] text-slate-500 leading-relaxed italic">
          * 실시간 데이터 수집을 위해서는 Firebase Firestore 또는 Supabase와 같은 <br/>
          클라우드 DB 연동이 필요합니다. 현재는 Local DB 상태를 시각화하고 있습니다.
        </p>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
