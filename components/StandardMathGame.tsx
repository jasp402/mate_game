'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StandardMathExercise } from '@/lib/gameData';
import { sounds } from '@/lib/sound';
import { ArrowLeft, HelpCircle, CheckCircle2 } from 'lucide-react';

interface StandardMathGameProps {
  exercise: StandardMathExercise;
  onBack: () => void;
  onComplete: (isFallback: boolean) => void;
}

const ITEM_EMOJIS = {
  apples: '🍎',
  stars: '⭐',
  candies: '🍬',
  blocks: '🧱',
  pizzas: '🍕',
};

export const StandardMathGame: React.FC<StandardMathGameProps> = ({ exercise, onBack, onComplete }) => {
  const [showHelp, setShowHelp] = useState(true);
  const [failedCount, setFailedCount] = useState(0);
  const [isFallback, setIsFallback] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const emoji = ITEM_EMOJIS[exercise.itemType] || '⭐';

  const handleOptionSelect = (val: number) => {
    if (val === exercise.correctAnswer) {
      sounds.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        onComplete(false);
      }, 1600);
    } else {
      sounds.playError();
      const nextFails = failedCount + 1;
      setFailedCount(nextFails);
      if (nextFails >= 10) {
        setIsFallback(true);
      } else {
        setFeedbackMsg('¡Casi! Cuenta bien los grupos de objetos e inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="p-4 flex flex-col justify-between min-h-screen bg-slate-900 text-white relative max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center z-10 gap-2">
        <button
          onClick={onBack}
          className="btn-touch px-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold flex items-center gap-2 text-slate-200 border border-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <h3 className="font-extrabold text-amber-400 text-sm md:text-base text-center line-clamp-1 px-2">
          {exercise.title}
        </h3>

        <button
          onClick={() => setShowHelp(true)}
          className="btn-touch px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold flex items-center gap-1 shadow-md"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Ayuda</span>
        </button>
      </div>

      {/* Instruction Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-x-4 top-20 max-w-lg mx-auto bg-gradient-to-b from-indigo-600 to-indigo-800 p-6 rounded-3xl shadow-2xl z-40 text-center border-2 border-indigo-400"
          >
            <div className="bg-indigo-500/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              💡
            </div>
            <h3 className="text-xl font-extrabold mb-2 text-amber-300">Instrucción</h3>
            <p className="text-lg font-medium mb-6 text-slate-100">{exercise.instruction}</p>
            <button
              onClick={() => {
                sounds.playPop();
                setShowHelp(false);
              }}
              className="btn-touch bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 rounded-2xl text-lg shadow-lg"
            >
              ¡Entendido! 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!isFallback ? (
        <main className="flex-1 flex flex-col justify-around my-6 gap-6">
          {feedbackMsg && (
            <div className="bg-amber-500/20 border border-amber-400/50 text-amber-200 text-sm p-3 rounded-2xl text-center font-medium">
              {feedbackMsg}
            </div>
          )}

          {/* Visual Equation Card */}
          <div className="bg-slate-800/90 border-2 border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col items-center">
            <div className="text-3xl md:text-5xl font-black text-indigo-300 mb-6 tracking-wide flex items-center gap-4">
              <span>{exercise.numA}</span>
              <span className="text-amber-400">{exercise.operator}</span>
              <span>{exercise.numB}</span>
              <span className="text-slate-400">=</span>
              <span className="text-amber-400">?</span>
            </div>

            {/* Visual Object Groups */}
            <div className="flex flex-wrap items-center justify-center gap-6 w-full">
              {/* Group A */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-wrap max-w-xs justify-center gap-2">
                {Array.from({ length: exercise.numA }).map((_, idx) => (
                  <motion.span
                    whileHover={{ scale: 1.2 }}
                    key={`a_${idx}`}
                    className="text-3xl md:text-4xl"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>

              <span className="text-3xl font-black text-amber-400">{exercise.operator}</span>

              {/* Group B */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-wrap max-w-xs justify-center gap-2">
                {Array.from({ length: exercise.numB }).map((_, idx) => (
                  <motion.span
                    whileHover={{ scale: 1.2 }}
                    key={`b_${idx}`}
                    className="text-3xl md:text-4xl"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-slate-800/60 p-5 rounded-3xl border border-slate-700/80 text-center">
            <p className="font-bold text-slate-200 mb-4 text-lg">¿Cuál es el resultado correcto?</p>
            <div className="grid grid-cols-3 gap-4">
              {exercise.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleOptionSelect(opt)}
                  className="btn-touch bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-2xl py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Success Overlay */}
          {isSuccess && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6 text-center"
            >
              <div className="text-7xl mb-4 animate-bounce">⭐</div>
              <h2 className="text-3xl font-extrabold text-amber-400 mb-2">¡Correcto!</h2>
              <p className="text-lg text-slate-200">¡Ganaste una estrella!</p>
            </motion.div>
          )}
        </main>
      ) : (
        /* Fallback Explicativo */
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-slate-800/90 border-2 border-amber-500/50 rounded-3xl my-4 shadow-2xl"
        >
          <div className="text-5xl mb-3">💡</div>
          <h3 className="text-2xl font-extrabold text-amber-400 mb-3">Explicación Paso a Paso</h3>
          <p className="text-lg font-medium text-slate-200 mb-6 max-w-md leading-relaxed">
            {exercise.explanation}
          </p>
          <button
            onClick={() => {
              sounds.playPop();
              onComplete(true);
            }}
            className="btn-touch bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-8 rounded-2xl text-lg shadow-xl flex items-center gap-2"
          >
            <span>Continuar</span>
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </motion.main>
      )}
    </div>
  );
};
