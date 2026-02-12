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
    try {
      // AdSense 광고 단위를 로드하기 위한 스크립트 실행
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense injection error:", e);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center ${className} ${
        type === 'box' ? 'min-h-[250px] max-w-[336px]' : 
        type === 'minimal' ? 'min-h-[60px] py-1' : 'min-h-[100px]'
      }`}
    >
      <div className="absolute top-1 left-4 flex items-center gap-1 opacity-20 z-0">
        <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-slate-400">Sponsored</span>
      </div>
      
      {/* 실제 AdSense 광고 태그 */}
      <div className="w-full h-full flex items-center justify-center z-10 overflow-hidden">
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: '100%' }}
             data-ad-client="ca-pub-2406565946467658"
             data-ad-slot={type === 'box' ? "auto" : "auto"} // 슬롯 ID가 없는 경우 'auto'로 설정하여 AdSense가 자동 결정하도록 유도
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>

      {/* 광고가 아직 활성화되지 않았을 때를 대비한 미세한 배경 텍스트 (사용자 경험 보호) */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
        <p className="text-[10px] text-slate-200 font-medium">Loading recommendations...</p>
      </div>
    </motion.div>
  );
};

export default AdSenseSlot;