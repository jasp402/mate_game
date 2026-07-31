'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StandardMathExercise } from '@/lib/gameData';
import { sounds } from '@/lib/sound';
import { ArrowLeft, HelpCircle, CheckCircle2, RotateCcw, X } from 'lucide-react';
import { SileoToast } from '@/components/SileoToast';

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
  toys: '🧸',
};

export const StandardMathGame: React.FC<StandardMathGameProps> = ({ exercise, onBack, onComplete }) => {
  const [showHelp, setShowHelp] = useState(true);
  const [failedCount, setFailedCount] = useState(0);
  const [isFallback, setIsFallback] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Subtraction interactive hammer state (stores indices of broken blocks)
  const [brokenIndices, setBrokenIndices] = useState<Set<number>>(new Set());
  const [boxRows, setBoxRows] = useState<number[]>([]);

  const emoji = ITEM_EMOJIS[exercise.itemType] || '🧱';
  const multiplicationTotal = exercise.numA * exercise.numB;
  const placedApples = boxRows.reduce((total, filledSlots) => total + filledSlots, 0);
  const hasEmptyAppleSlot = boxRows.some((filledSlots) => filledSlots < exercise.numB);

  const addBoxRow = () => {
    if (boxRows.length >= exercise.numA) {
      setFeedbackMsg(`Ya creaste las ${exercise.numA} cajas.`);
      return;
    }

    sounds.playPop();
    setBoxRows((prev) => [...prev, 0]);
  };

  const fillNextAppleSlot = () => {
    const rowIndex = boxRows.findIndex((filledSlots) => filledSlots < exercise.numB);

    if (rowIndex === -1) {
      setFeedbackMsg(boxRows.length === 0 ? 'Primero toca la caja para crear una fila.' : 'Todos los espacios ya están llenos.');
      return;
    }

    sounds.playPop();
    setBoxRows((prev) =>
      prev.map((filledSlots, index) => (index === rowIndex ? filledSlots + 1 : filledSlots)),
    );
  };

  const resetMultiplicationRows = () => {
    sounds.playPop();
    setBoxRows([]);
  };

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
        setFeedbackMsg('¡Casi! Cuenta bien los objetos enteros e inténtalo de nuevo.');
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
        <main className="flex-1 flex flex-col justify-around my-4 gap-4">
          <SileoToast
            message={feedbackMsg}
            onClose={() => setFeedbackMsg(null)}
            type="warning"
            durationMs={10000}
          />

          {/* Story Card for Odd Exercises (1, 3, 5, 7, 9) */}
          {exercise.isStory && (
            <div className="bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 border-2 border-amber-400/50 rounded-3xl p-4 md:p-5 shadow-lg flex items-start gap-3 md:gap-4">
              <div className="text-4xl bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700 shrink-0 shadow-md">
                {exercise.characterAvatar || '👦🏼'}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-black text-amber-400 mb-1">
                  Historia de {exercise.characterName}
                </div>
                <p className="text-base md:text-lg font-bold text-slate-100 leading-snug">
                  {exercise.storyText}
                </p>
              </div>
            </div>
          )}

          {/* Prominent Operation Card for All Exercises */}
          <div className="bg-slate-800/90 border-2 border-indigo-500/60 rounded-3xl p-3.5 md:p-4 text-center shadow-lg">
            <span className="text-xs font-black uppercase text-indigo-300 tracking-wider">
              {exercise.isStory ? 'Operación Matemáticas' : 'Operación Directa (Comprobación de Concepto)'}
            </span>
            <div className="text-3xl md:text-4xl font-black text-amber-400 mt-1 flex items-center justify-center gap-3">
              <span>{exercise.numA}</span>
              <span className="text-amber-300">{exercise.operator}</span>
              <span>{exercise.numB}</span>
              <span className="text-slate-400">=</span>
              <span className="text-amber-300">?</span>
            </div>
          </div>

          {/* Zona de Resolución */}
          {exercise.operator === '-' ? (
            /* Subtraction Interactive Hammer Tool (Resta) */
            <div className="bg-slate-800/90 border-2 border-slate-700 rounded-3xl p-4 md:p-5 shadow-xl flex flex-col items-center">
              <div className="text-xs uppercase font-black tracking-widest text-emerald-400 mb-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Zona de Resolución
              </div>

              <div className="flex items-center justify-between w-full mb-3 gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/50 px-3 py-1.5 rounded-xl">
                  <span className="text-xl">🔨</span>
                  <span className="font-extrabold text-amber-300 text-xs md:text-sm">
                    Herramienta Martillo Activa
                  </span>
                </div>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setBrokenIndices(new Set());
                  }}
                  className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 bg-slate-700/80 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all border border-slate-600"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar</span>
                </button>
              </div>

              <p className="text-xs md:text-sm text-slate-200 mb-3 text-center font-semibold">
                ¡Haz clic sobre los objetos para romperlos con el martillo (❌) y contar los que quedan intactos!
              </p>

              {/* Interactive Items Grid */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3.5 max-w-md my-2">
                {Array.from({ length: exercise.numA }).map((_, idx) => {
                  const isBroken = brokenIndices.has(idx);
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        sounds.playPop();
                        setBrokenIndices((prev) => {
                          const next = new Set(prev);
                          if (next.has(idx)) {
                            next.delete(idx);
                          } else {
                            next.add(idx);
                          }
                          return next;
                        });
                      }}
                      className={`relative w-13 h-13 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl border-2 transition-all shadow-md ${
                        isBroken
                          ? 'bg-rose-950/70 border-rose-500/90 opacity-80 scale-95'
                          : 'bg-slate-800 border-slate-600 hover:border-amber-400 hover:bg-slate-700'
                      }`}
                    >
                      <span>{emoji}</span>
                      {isBroken && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-rose-950/70 rounded-2xl border-2 border-rose-500"
                        >
                          <X className="w-8 h-8 md:w-10 md:h-10 text-rose-400 stroke-[3.5]" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Counting Stats Bar */}
              <div className="mt-3 flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm font-extrabold w-full pt-3 border-t border-slate-700/80">
                <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
                  Iniciales: <span className="text-white">{exercise.numA}</span>
                </div>
                <div className="bg-rose-950/50 px-3 py-1.5 rounded-xl border border-rose-800/80 text-rose-300">
                  Rotos (🔨): <span className="text-rose-200">{brokenIndices.size}</span>
                </div>
                <div className="bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-800/80 text-emerald-300">
                  Intactos: <span className="text-emerald-200">{exercise.numA - brokenIndices.size}</span>
                </div>
              </div>
            </div>
          ) : exercise.operator === '×' ? (
            <div className="bg-slate-800/90 border-2 border-slate-700 rounded-3xl p-4 md:p-5 shadow-xl flex flex-col items-center">
              <div className="text-xs uppercase font-black tracking-widest text-emerald-400 mb-4 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Zona de Resolución
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <button
                  onClick={addBoxRow}
                  disabled={boxRows.length >= exercise.numA}
                  className="btn-touch bg-emerald-950/70 hover:bg-emerald-900 disabled:opacity-60 border-2 border-emerald-500/70 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 transition-all"
                >
                  <span className="text-5xl" aria-hidden="true">📦</span>
                  <span className="font-black text-lg text-emerald-100">Caja</span>
                </button>

                <button
                  draggable={hasEmptyAppleSlot}
                  onClick={fillNextAppleSlot}
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', 'apple');
                    event.dataTransfer.effectAllowed = 'copy';
                  }}
                  className="btn-touch bg-sky-950/70 hover:bg-sky-900 border-2 border-sky-500/70 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 transition-all"
                >
                  <span className="text-5xl drop-shadow-md" aria-hidden="true">🍎</span>
                  <span className="font-black text-lg text-sky-100">Manzana</span>
                </button>
              </div>

              <div className="w-full max-w-lg mt-4 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm font-extrabold">
                  <div className="bg-emerald-950/60 border border-emerald-500/50 px-3 py-1.5 rounded-full text-emerald-100">
                    Cajas: <span className="text-white">{boxRows.length}</span> / {exercise.numA}
                  </div>
                  <div className="bg-sky-950/60 border border-sky-500/50 px-3 py-1.5 rounded-full text-sky-100">
                    Manzanas: <span className="text-white">{placedApples}</span> / {multiplicationTotal}
                  </div>
                  <button
                    onClick={resetMultiplicationRows}
                    className="bg-slate-700/80 hover:bg-slate-700 border border-slate-600 px-3 py-1.5 rounded-full text-slate-200 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar</span>
                  </button>
                </div>

                <p className="text-sm md:text-base text-slate-200 text-center font-semibold">
                  Toca la caja para crear una fila con {exercise.numB} espacios. Luego arrastra o toca manzanas para llenarlos.
                </p>

                <div className="space-y-3">
                  {boxRows.length === 0 && (
                    <div className="border-2 border-dashed border-slate-600 rounded-3xl p-5 text-center text-slate-400 font-bold">
                      Toca <span className="text-emerald-300">Caja</span> para crear el primer grupo.
                    </div>
                  )}

                  {boxRows.map((filledSlots, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-3">
                      <div
                        onDragOver={(event) => {
                          if (filledSlots < exercise.numB) {
                            event.preventDefault();
                            event.dataTransfer.dropEffect = 'copy';
                          }
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          if (event.dataTransfer.getData('text/plain') === 'apple') {
                            setBoxRows((prev) =>
                              prev.map((slotCount, index) =>
                                index === rowIndex && slotCount < exercise.numB ? slotCount + 1 : slotCount,
                              ),
                            );
                            sounds.playPop();
                          }
                        }}
                        className={`flex-1 rounded-2xl border-2 p-2.5 grid gap-2 transition-all ${
                          filledSlots === exercise.numB
                            ? 'bg-emerald-950/50 border-emerald-400/80'
                            : 'bg-amber-950/40 border-amber-500/70'
                        }`}
                        style={{ gridTemplateColumns: `repeat(${exercise.numB}, minmax(0, 1fr))` }}
                      >
                        {Array.from({ length: exercise.numB }).map((_, slotIndex) => {
                          const isFilled = slotIndex < filledSlots;
                          return (
                            <button
                              key={slotIndex}
                              onClick={() => {
                                if (!isFilled) {
                                  setBoxRows((prev) =>
                                    prev.map((slotCount, index) =>
                                      index === rowIndex && slotCount < exercise.numB ? slotCount + 1 : slotCount,
                                    ),
                                  );
                                  sounds.playPop();
                                }
                              }}
                              className={`aspect-[1.35] min-h-12 rounded-xl border-2 border-dashed flex items-center justify-center text-3xl transition-all ${
                                isFilled
                                  ? 'bg-slate-900/50 border-amber-300/70'
                                  : 'bg-slate-950/40 border-amber-200/40 hover:border-sky-300'
                              }`}
                            >
                              {isFilled ? '🍎' : ''}
                            </button>
                          );
                        })}
                      </div>

                      <div className="w-9 h-9 rounded-full border-2 border-emerald-400 text-emerald-200 flex items-center justify-center font-black">
                        {rowIndex + 1}
                      </div>
                    </div>
                  ))}
                </div>

                {boxRows.length === exercise.numA && placedApples === multiplicationTotal && (
                  <div className="bg-emerald-500/15 border border-emerald-400/60 rounded-2xl px-4 py-3 text-center font-black text-emerald-100">
                    {exercise.numA} cajas x {exercise.numB} manzanas = {multiplicationTotal}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Visual Equation Card for Addition, Multiplication, Division */
            <div className="bg-slate-800/90 border-2 border-slate-700 rounded-3xl p-5 shadow-xl flex flex-col items-center">
              <div className="text-xs uppercase font-black tracking-widest text-emerald-400 mb-3 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Zona de Resolución
              </div>

              {/* Visual Object Groups */}
              <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                {/* Group A */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex flex-wrap max-w-xs justify-center gap-2">
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
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex flex-wrap max-w-xs justify-center gap-2">
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
          )}

          {/* Options */}
          <div className="bg-slate-800/60 p-4 md:p-5 rounded-3xl border border-slate-700/80 text-center">
            <p className="font-extrabold text-slate-100 mb-3 text-base md:text-lg">
              ¿Cuál es la respuesta correcta?
            </p>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {exercise.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleOptionSelect(opt)}
                  className="btn-touch bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-2xl md:text-3xl py-3.5 md:py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
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
              <h2 className="text-3xl font-extrabold text-amber-400 mb-2">¡Excelente Trabajo!</h2>
              <p className="text-lg text-slate-200">¡Lograste resolver la operación correctamente!</p>
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
