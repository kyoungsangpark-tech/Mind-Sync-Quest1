import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface Props {
  type: 'banner' | 'box' | 'minimal';
  className?: string;
}

const AdSenseSlot: React.FC<Props> = ({ type, className = "" }) => {
  useEffect(() => {
    // 0.5초 대기 후 광고 푸시 (컴포넌트 마운트 안정화 후)
    const timeout = setTimeout(() => {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.debug(`[AdSense] Slot initialized: ${type}`);
        }
      } catch (e) {
        console.warn("[AdSense] Integration error or Adblocker active:", e);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [type]);

  const heightClass = type === 'box' ? 'min-h-[250px]' : type === 'minimal' ? 'min-h-[60px]' : 'min-h-[100px]';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center ${className} ${heightClass}`}
    >
      <div className="absolute top-2 left-4 flex items-center gap-1 opacity-20 z-0 pointer-events-none">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">Recommendation</span>
      </div>
      
      {/* AdSense Unit */}
      <div className="w-full h-full min-w-[250px] flex items-center justify-center z-10">
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: '100%' }}
             data-ad-client="ca-pub-2406565946467658"
             data-ad-slot="auto"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>

      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-slate-100 border-t-slate-200 animate-spin" />
          <p className="text-[10px] text-slate-300 font-medium">Matching your context...</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdSenseSlot;