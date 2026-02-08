
import React from 'react';
import { QuestResult } from '../types';
import { motion } from 'framer-motion';
import { CheckCircle, Share2, Sparkles, Zap, Info, Wand2 } from 'lucide-react';

interface Props {
  quest: QuestResult;
  onComplete: () => void;
}

const QuestCard: React.FC<Props> = ({ quest, onComplete }) => {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full max-w-md relative group"
    >
      {/* AI Quest Glow Effect: 세련된 다이내믹 글로우로 '스페셜'함 강조 */}
      {quest.isAiGenerated && (
        <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.6rem] blur-xl opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      )}

      <div className="relative bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 flex flex-col">
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-white relative">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1.5">
              {quest.isAiGenerated ? (
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.25em]"
                >
                  <Wand2 size={12} className="animate-bounce" />
                  <span>Personalized Insight</span>
                </motion.div>
              ) : (
                <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Daily Refresh</h4>
              )}
              <h2 className="text-3xl font-bold font-outfit leading-tight pr-10">
                {quest.title}
              </h2>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                  <Zap size={10} className="text-yellow-400" />
                  {quest.tag}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          {/* Main Instruction */}
          <div className="space-y-4">
            <div className={`w-10 h-1.5 rounded-full ${quest.isAiGenerated ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-indigo-600'}`}></div>
            <p className="text-slate-800 leading-relaxed text-xl font-bold tracking-tight">
              {quest.instruction}
            </p>
          </div>

          {/* Rationale Section: 심리학적 근거를 디자인 요소로 통합 */}
          <div className={`flex items-start gap-3.5 p-5 rounded-3xl border transition-colors ${
            quest.isAiGenerated 
              ? 'bg-indigo-50/50 border-indigo-100/50 text-indigo-900' 
              : 'bg-slate-50 border-slate-100 text-slate-700'
          }`}>
             <Info size={18} className={`${quest.isAiGenerated ? 'text-indigo-500' : 'text-slate-400'} mt-0.5 flex-shrink-0`} />
             <div className="space-y-1">
                <p className={`text-[9px] font-bold uppercase tracking-[0.15em] ${quest.isAiGenerated ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {quest.isAiGenerated ? 'Why it works for you' : 'Mind Psychology'}
                </p>
                <p className="text-sm leading-relaxed font-medium opacity-90">{quest.rationale}</p>
             </div>
          </div>
          
          <div className="flex items-start gap-4 p-5 bg-slate-50/30 rounded-3xl border border-slate-100/50">
            <div className={`p-2.5 rounded-2xl shadow-sm flex-shrink-0 ${quest.isAiGenerated ? 'bg-white text-indigo-500' : 'bg-white text-slate-400'}`}>
              <Sparkles size={18} />
            </div>
            <p className="text-slate-500 italic text-sm leading-relaxed">
              {quest.encouragement}
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className={`w-full text-white font-bold py-5 rounded-[1.8rem] shadow-xl transition-all flex items-center justify-center gap-3 text-lg ${
                quest.isAiGenerated 
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 shadow-indigo-100' 
                  : 'bg-slate-900 shadow-slate-200'
              }`}
            >
              <CheckCircle size={22} />
              Quest Complete
            </motion.button>
            
            <button className="w-full text-slate-400 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-slate-50 text-sm">
              <Share2 size={16} />
              Experience Shared
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestCard;
