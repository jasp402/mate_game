'use client';

import React from 'react';
import { motion } from 'motion/react';
import { OperationType, ExerciseProgress, OPERATION_METADATA } from '@/lib/gameData';
import { sounds } from '@/lib/sound';
import { ArrowLeft, Lock, Star, Frown, Play, Sparkles } from 'lucide-react';

interface GridScreenProps {
  operation: OperationType;
  grade: number;
  exercises: ExerciseProgress[];
  onBack: () => void;
  onSelectExercise: (id: number) => void;
}

export const GridScreen: React.FC<GridScreenProps> = ({
  operation,
  grade,
  exercises,
  onBack,
  onSelectExercise,
}) => {
  const meta = OPERATION_METADATA[operation];
  const completedStars = exercises.filter((e) => e.status === 'completed').length;

  return (
    <div className="p-6 flex flex-col min-h-screen text-white max-w-xl mx-auto selection:bg-amber-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="btn-touch px-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold flex items-center gap-2 text-slate-200 border border-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Menú</span>
        </button>

        <div className="text-right">
          <h2 className="font-extrabold text-lg text-slate-100 flex items-center gap-1.5 justify-end">
            <span>{meta.icon}</span>
            <span>{meta.name}</span>
          </h2>
          <span className="text-xs text-amber-400 font-bold">{grade}.º Grado</span>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 mb-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-400/40">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-200 text-sm">Progreso de la Aventura</h4>
            <p className="text-xs text-slate-400">Completa cada ejercicio para desbloquear el siguiente</p>
          </div>
        </div>
        <div className="flex items-center gap-1 font-black text-amber-400 text-xl bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Star className="w-5 h-5 fill-amber-400" />
          <span>{completedStars}/10</span>
        </div>
      </div>

      {/* Exercises 2x5 Grid */}
      <div className="grid grid-cols-2 gap-4 my-auto">
        {exercises.map((ex) => {
          const isLocked = ex.status === 'locked';
          const isCompleted = ex.status === 'completed';
          const isFallback = ex.status === 'fallback';
          const isAvailable = ex.status === 'available';

          return (
            <motion.button
              key={ex.id}
              disabled={isLocked}
              whileHover={!isLocked ? { scale: 1.04 } : {}}
              whileTap={!isLocked ? { scale: 0.96 } : {}}
              onClick={() => {
                if (!isLocked) {
                  sounds.playPop();
                  onSelectExercise(ex.id);
                }
              }}
              className={`h-28 rounded-3xl flex flex-col items-center justify-center font-extrabold text-lg transition-all border-2 relative overflow-hidden shadow-lg ${
                isLocked
                  ? 'bg-slate-800/50 border-slate-700/60 text-slate-600 cursor-not-allowed'
                  : isCompleted
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : isFallback
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-indigo-600 border-indigo-400 text-white hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
            >
              <span className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-1">
                Ejercicio {ex.id}
              </span>

              <div className="text-3xl mt-1">
                {isLocked && <Lock className="w-7 h-7 text-slate-600" />}
                {isCompleted && <Star className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />}
                {isFallback && <Frown className="w-8 h-8 text-rose-400" />}
                {isAvailable && <Play className="w-8 h-8 text-white fill-white ml-1" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
