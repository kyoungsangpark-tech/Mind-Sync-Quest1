
import React from 'react';
import { MBTIState, MBTIDimension } from '../types';
import { MBTI_DETAILS } from '../constants';
import { motion } from 'framer-motion';

interface Props {
  mbti: MBTIState;
  setMbti: React.Dispatch<React.SetStateAction<MBTIState>>;
}

const MBTISelector: React.FC<Props> = ({ mbti, setMbti }) => {
  const toggle = (dim: MBTIDimension) => {
    setMbti(prev => {
      switch (dim) {
        case 'EI': return { ...prev, E: !prev.E };
        case 'SN': return { ...prev, S: !prev.S };
        case 'TF': return { ...prev, T: !prev.T };
        case 'JP': return { ...prev, J: !prev.J };
      }
    });
  };

  const renderToggle = (dim: MBTIDimension, leftVal: string, rightVal: string, isLeftActive: boolean) => {
    const leftDetail = MBTI_DETAILS[leftVal as keyof typeof MBTI_DETAILS];
    const rightDetail = MBTI_DETAILS[rightVal as keyof typeof MBTI_DETAILS];

    return (
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <div 
          onClick={() => toggle(dim)}
          className="h-20 bg-white/60 backdrop-blur-sm rounded-3xl p-2 cursor-pointer relative flex items-center shadow-sm border border-slate-200/50 group"
        >
          <motion.div 
            animate={{ x: isLeftActive ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-2 top-2 bottom-2 w-[calc(50%-8px)] bg-indigo-600 rounded-2xl shadow-lg flex flex-col items-center justify-center z-10"
          >
            <span className="text-white font-bold text-xl font-outfit">
              {isLeftActive ? leftVal : rightVal}
            </span>
            <span className="text-white/70 text-[10px] font-medium hidden sm:block">
              {isLeftActive ? leftDetail.title : rightDetail.title}
            </span>
          </motion.div>
          
          <div className="flex-1 flex flex-col items-center justify-center transition-opacity duration-300 px-2">
            <span className={`font-bold text-lg ${isLeftActive ? 'opacity-0' : 'text-slate-400'}`}>{leftVal}</span>
            <span className={`text-[10px] text-slate-400 text-center leading-tight ${isLeftActive ? 'opacity-0' : 'opacity-100'}`}>
              {leftDetail.desc}
            </span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center transition-opacity duration-300 px-2">
            <span className={`font-bold text-lg ${!isLeftActive ? 'opacity-0' : 'text-slate-400'}`}>{rightVal}</span>
            <span className={`text-[10px] text-slate-400 text-center leading-tight ${!isLeftActive ? 'opacity-0' : 'opacity-100'}`}>
              {rightDetail.desc}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {renderToggle('EI', 'E', 'I', mbti.E)}
      {renderToggle('SN', 'S', 'N', mbti.S)}
      {renderToggle('TF', 'T', 'F', mbti.T)}
      {renderToggle('JP', 'J', 'P', mbti.J)}
    </div>
  );
};

export default MBTISelector;
