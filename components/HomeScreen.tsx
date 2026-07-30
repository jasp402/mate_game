'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Profile, OperationType, OPERATION_METADATA } from '@/lib/gameData';
import { sounds } from '@/lib/sound';
import { Settings, Play, Star, Trophy, ChevronRight } from 'lucide-react';

interface HomeScreenProps {
  profile: Profile;
  totalStars: number;
  hasUnfinished: boolean;
  onOpenProfile: () => void;
  onSelectOperation: (op: OperationType) => void;
  onContinue: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  totalStars,
  hasUnfinished,
  onOpenProfile,
  onSelectOperation,
  onContinue,
}) => {
  const operations: OperationType[] = ['addition', 'subtraction', 'multiplication', 'division'];

  return (
    <div className="p-6 flex flex-col justify-between min-h-screen bg-slate-900 text-white max-w-xl mx-auto selection:bg-amber-500">
      {/* User Header */}
      <div className="flex justify-between items-center bg-slate-800/80 backdrop-blur p-3 rounded-2xl border border-slate-700/80 shadow-md">
        <button
          onClick={() => {
            sounds.playPop();
            onOpenProfile();
          }}
          className="flex items-center gap-3 hover:bg-slate-700/60 p-2 rounded-xl transition-colors"
        >
          <span className="text-3xl bg-slate-700 p-2 rounded-xl border border-slate-600">{profile.avatar}</span>
          <div className="text-left">
            <h3 className="font-extrabold text-slate-100 text-base leading-tight">{profile.name}</h3>
            <p className="text-xs text-amber-400 font-bold">{profile.grade}.º Grado ⚙️</p>
          </div>
        </button>

        {/* Total Stars Badge */}
        <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 px-3 py-1.5 rounded-xl">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="font-black text-amber-300 text-lg">{totalStars}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="my-auto py-6 space-y-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Aventuras Matemáticas</span>
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-100">¿Qué aventura deseas iniciar hoy?</h2>
        </div>

        {/* Operations Grid */}
        <div className="grid grid-cols-1 gap-3.5">
          {operations.map((op) => {
            const meta = OPERATION_METADATA[op];
            return (
              <motion.button
                key={op}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sounds.playPop();
                  onSelectOperation(op);
                }}
                className={`btn-touch ${meta.bg} hover:brightness-110 text-white font-extrabold text-lg rounded-2xl p-4 flex justify-between items-center shadow-lg border border-white/20 transition-all`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{meta.icon}</span>
                  <span className="font-black text-xl">{meta.name}</span>
                </div>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Continuar Button */}
      {hasUnfinished && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            sounds.playPop();
            onContinue();
          }}
          className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black py-4 rounded-2xl text-xl shadow-xl flex items-center justify-center gap-3 mb-2 animate-bounce"
        >
          <Play className="w-6 h-6 fill-slate-950" />
          <span>Continuar Aventura</span>
        </motion.button>
      )}
    </div>
  );
};
