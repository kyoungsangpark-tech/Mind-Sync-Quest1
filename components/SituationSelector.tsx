
import React from 'react';
import { Situation } from '../types';
import { SITUATIONS } from '../constants';
import { motion } from 'framer-motion';

interface Props {
  selected: Situation;
  setSelected: (s: Situation) => void;
}

const SituationSelector: React.FC<Props> = ({ selected, setSelected }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
      {SITUATIONS.map((s) => (
        <motion.button
          key={s.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelected(s.id)}
          className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all gap-3 ${
            selected === s.id 
            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-lg' 
            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
          }`}
        >
          <div className={`${selected === s.id ? 'text-indigo-600' : 'text-slate-400'}`}>
            {s.icon}
          </div>
          <span className="font-semibold text-sm">{s.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default SituationSelector;
