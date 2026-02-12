import React, { useEffect, useRef } from 'react';
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
  const adInjected = useRef(false);

  useEffect(() => {
    // 광고가 이미 주입되었는지 확인하여 중복 푸시 방지
    if (adInjected.current) return;

    const timeout = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adInjected.current = true;
          console.debug(`[AdSense] Slot Rendered: ${type}`);
        }
      } catch (e) {
        console.warn("[AdSense] Component Error:", e);
      }
    }, 700);

    return () => clearTimeout(timeout);
  }, [type]);

  const heightClass = type === 'box' ? 'min-h-[250px]' : type === 'minimal' ? 'min-h-[60px]' : 'min-h-[100px]';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-inner flex flex-col items-center justify-center ${className} ${heightClass}`}
    >
      <div className="absolute top-2 left-4 flex items-center gap-1 opacity-30 z-0 pointer-events-none">
        <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-slate-400">Personalized Recommendation</span>
      </div>
      
      {/* Actual AdSense Unit */}
      <div className="w-full h-full min-w-[250px] flex items-center justify-center z-10">
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: '100%' }}
             data-ad-client="ca-pub-2406565946467658"
             data-ad-slot="auto"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>

      {/* Placeholder UI while loading or if ad is blocked */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Optimizing for ${type}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdSenseSlot;