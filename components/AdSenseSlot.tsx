
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface Props {
  type: 'banner' | 'box' | 'minimal';
  className?: string;
}

const AdSenseSlot: React.FC<Props> = ({ type, className = "" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center p-4 ${className} ${
        type === 'box' ? 'aspect-[4/3] max-w-[320px]' : 
        type === 'minimal' ? 'h-16 py-2' : 'h-24'
      }`}
    >
      <div className="absolute top-2 left-4 flex items-center gap-1 opacity-30">
        <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-slate-400">Sponsored Content</span>
      </div>
      
      {/* Ad Placeholder UI: 더 절제된 디자인 */}
      <div className="w-full h-full border border-dashed border-slate-200/50 rounded-2xl flex items-center justify-center gap-4 px-4">
        <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 flex-shrink-0">
          <ExternalLink size={14} />
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] text-slate-400 font-medium leading-tight">
            당신의 일상을 더 풍요롭게 만들<br/>
            {type === 'minimal' ? '추천 파트너를 만나보세요' : '맞춤형 콘텐츠가 준비되어 있습니다.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdSenseSlot;
