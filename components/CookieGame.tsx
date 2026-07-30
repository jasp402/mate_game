'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CookieExerciseConfig } from '@/lib/gameData';
import { sounds } from '@/lib/sound';
import { ArrowLeft, HelpCircle, RotateCcw, Scissors, Hand, Sparkles, CheckCircle2 } from 'lucide-react';

interface CookiePiece {
  id: string;
  type: 'whole' | 'half' | 'quarter';
  owner: string | null; // character id or null (table)
}

interface CookieGameProps {
  exercise: CookieExerciseConfig;
  onBack: () => void;
  onComplete: (isFallback: boolean) => void;
}

export const CookieItem: React.FC<{
  type: 'whole' | 'half' | 'quarter';
  size?: number;
  selected?: boolean;
  onClick?: () => void;
}> = ({ type, size = 60, selected, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`cursor-pointer inline-block transition-all relative ${
        selected ? 'ring-4 ring-amber-400 rounded-full drop-shadow-xl scale-110 z-10' : ''
      }`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {type === 'whole' && (
          <g>
            <circle cx="50" cy="50" r="45" fill="#d7ccc8" stroke="#8d6e63" strokeWidth="4" />
            <circle cx="50" cy="50" r="41" fill="#bcaaa4" />
            <circle cx="35" cy="35" r="6" fill="#4e342e" />
            <circle cx="65" cy="35" r="7" fill="#4e342e" />
            <circle cx="45" cy="65" r="6" fill="#4e342e" />
            <circle cx="68" cy="62" r="5" fill="#4e342e" />
            <circle cx="28" cy="55" r="5" fill="#4e342e" />
          </g>
        )}
        {type === 'half' && (
          <g>
            <path d="M 50 5 A 45 45 0 0 1 50 95 Z" fill="#bcaaa4" stroke="#8d6e63" strokeWidth="4" />
            <circle cx="65" cy="35" r="6" fill="#4e342e" />
            <circle cx="65" cy="65" r="6" fill="#4e342e" />
            <circle cx="75" cy="50" r="5" fill="#4e342e" />
          </g>
        )}
        {type === 'quarter' && (
          <g>
            <path d="M 50 50 L 95 50 A 45 45 0 0 0 50 5 Z" fill="#bcaaa4" stroke="#8d6e63" strokeWidth="4" />
            <circle cx="68" cy="30" r="5" fill="#4e342e" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};

export const CookieGame: React.FC<CookieGameProps> = ({ exercise, onBack, onComplete }) => {
  const [tool, setTool] = useState<'move' | 'cut2' | 'cut4'>('move');
  const [showHelp, setShowHelp] = useState(true);
  const [failedCount, setFailedCount] = useState(0);
  const [isFallback, setIsFallback] = useState(false);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initial cookies setup
  const [cookies, setCookies] = useState<CookiePiece[]>(() =>
    Array.from({ length: exercise.initialCookies }, (_, i) => ({
      id: `c_${i + 1}`,
      type: 'whole',
      owner: null,
    }))
  );

  const resetCookies = () => {
    sounds.playPop();
    setCookies(
      Array.from({ length: exercise.initialCookies }, (_, i) => ({
        id: `c_${i + 1}`,
        type: 'whole',
        owner: null,
      }))
    );
    setSelectedPieceId(null);
    setFeedbackMsg(null);
  };

  const sliceCounter = React.useRef(0);

  const handleCookieClick = (c: CookiePiece) => {
    if (tool === 'cut2') {
      if (c.type === 'whole') {
        sounds.playSlice();
        sliceCounter.current += 1;
        const tag = sliceCounter.current;
        const newPieces: CookiePiece[] = [
          { id: `${c.id}_h1_${tag}`, type: 'half', owner: c.owner },
          { id: `${c.id}_h2_${tag}`, type: 'half', owner: c.owner },
        ];
        setCookies((prev) => prev.filter((item) => item.id !== c.id).concat(newPieces));
      } else {
        setFeedbackMsg('Esta pieza ya fue cortada en mitad. ¡Prueba a cortarla en cuartos o moverla!');
      }
    } else if (tool === 'cut4') {
      sliceCounter.current += 1;
      const tag = sliceCounter.current;
      if (c.type === 'whole') {
        sounds.playSlice();
        const newPieces: CookiePiece[] = [
          { id: `${c.id}_q1_${tag}`, type: 'quarter', owner: c.owner },
          { id: `${c.id}_q2_${tag}`, type: 'quarter', owner: c.owner },
          { id: `${c.id}_q3_${tag}`, type: 'quarter', owner: c.owner },
          { id: `${c.id}_q4_${tag}`, type: 'quarter', owner: c.owner },
        ];
        setCookies((prev) => prev.filter((item) => item.id !== c.id).concat(newPieces));
      } else if (c.type === 'half') {
        sounds.playSlice();
        const newPieces: CookiePiece[] = [
          { id: `${c.id}_q1_${tag}`, type: 'quarter', owner: c.owner },
          { id: `${c.id}_q2_${tag}`, type: 'quarter', owner: c.owner },
        ];
        setCookies((prev) => prev.filter((item) => item.id !== c.id).concat(newPieces));
      } else {
        setFeedbackMsg('Esta pieza ya es un cuarto (1/4) y no se puede cortar más.');
      }
    } else {
      sounds.playPop();
      setSelectedPieceId(selectedPieceId === c.id ? null : c.id);
    }
  };

  const assignTo = (charId: string | null) => {
    if (!selectedPieceId) return;
    sounds.playPop();
    setCookies((prev) =>
      prev.map((c) => (c.id === selectedPieceId ? { ...c, owner: charId } : c))
    );
    setSelectedPieceId(null);
  };

  // Check if cookies are equitably distributed among all characters
  const calculateTotalVal = (charId: string) => {
    const pieces = cookies.filter((c) => c.owner === charId);
    return pieces.reduce((sum, p) => {
      if (p.type === 'whole') return sum + 1;
      if (p.type === 'half') return sum + 0.5;
      if (p.type === 'quarter') return sum + 0.25;
      return sum;
    }, 0);
  };

  const unassignedCount = cookies.filter((c) => c.owner === null).length;
  const values = exercise.characters.map((char) => calculateTotalVal(char.id));
  const isEquitable =
    unassignedCount === 0 &&
    values.length > 0 &&
    values.every((v) => Math.abs(v - values[0]) < 0.01) &&
    values[0] > 0;

  const handleOptionSelect = (optionText: string) => {
    if (optionText === exercise.targetFractionText) {
      sounds.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        onComplete(false);
      }, 1800);
    } else {
      sounds.playError();
      const nextFails = failedCount + 1;
      setFailedCount(nextFails);
      if (nextFails >= 10) {
        setIsFallback(true);
      } else {
        setFeedbackMsg('¡Casi! Revisa bien cuántas partes enteras y fracciones tiene cada plato e inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="p-4 flex flex-col justify-between min-h-screen bg-slate-900 text-white relative max-w-2xl mx-auto selection:bg-amber-500">
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
            className="fixed inset-x-4 top-16 md:top-24 max-w-lg mx-auto bg-gradient-to-b from-indigo-600 to-indigo-800 p-6 rounded-3xl shadow-2xl z-40 text-center border-2 border-indigo-400"
          >
            <div className="bg-indigo-500/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              💡
            </div>
            <h3 className="text-xl font-extrabold mb-2 text-amber-300">Instrucción del Ejercicio</h3>
            <p className="text-lg font-medium mb-6 text-slate-100">{exercise.instruction}</p>
            <button
              onClick={() => {
                sounds.playPop();
                setShowHelp(false);
              }}
              className="btn-touch bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 rounded-2xl text-lg shadow-lg"
            >
              ¡Entendido, a jugar! 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!isFallback ? (
        <main className="flex-1 flex flex-col justify-around my-4 gap-4">
          {/* Feedback message banner */}
          <AnimatePresence>
            {feedbackMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-amber-500/20 border border-amber-400/50 text-amber-200 text-sm p-3 rounded-2xl text-center font-medium"
              >
                {feedbackMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toolbar */}
          <div className="flex flex-wrap justify-center gap-2 bg-slate-800/80 backdrop-blur p-2 rounded-2xl border border-slate-700">
            <button
              onClick={() => {
                sounds.playPop();
                setTool('move');
              }}
              className={`btn-touch px-3 py-2 flex-1 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
                tool === 'move' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-700/80 text-slate-200'
              }`}
            >
              <Hand className="w-4 h-4" />
              <span>Mover</span>
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setTool('cut2');
              }}
              className={`btn-touch px-3 py-2 flex-1 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
                tool === 'cut2' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-700/80 text-slate-200'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Cortar (1/2)</span>
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setTool('cut4');
              }}
              className={`btn-touch px-3 py-2 flex-1 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
                tool === 'cut4' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-700/80 text-slate-200'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Cortar (1/4)</span>
            </button>
            <button
              onClick={resetCookies}
              title="Reiniciar galletas"
              className="btn-touch px-3 py-2 bg-rose-600/80 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Table / Mesa principal sin dueño */}
          <div
            onClick={() => assignTo(null)}
            className={`min-h-32 bg-slate-800/60 border-2 border-dashed ${
              selectedPieceId ? 'border-amber-400 bg-amber-500/10' : 'border-slate-700'
            } rounded-3xl p-4 flex flex-wrap justify-center items-center gap-3 transition-colors`}
          >
            {cookies.filter((c) => c.owner === null).length === 0 ? (
              <span className="text-slate-500 text-sm font-medium">¡Todas las galletas están repartidas!</span>
            ) : (
              cookies
                .filter((c) => c.owner === null)
                .map((c) => (
                  <CookieItem
                    key={c.id}
                    type={c.type}
                    selected={selectedPieceId === c.id}
                    onClick={() => handleCookieClick(c)}
                  />
                ))
            )}
          </div>

          {/* Characters and Plates */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {exercise.characters.map((char) => {
              const charPieces = cookies.filter((c) => c.owner === char.id);
              return (
                <div
                  key={char.id}
                  onClick={() => assignTo(char.id)}
                  className={`bg-slate-800/90 p-3 rounded-3xl flex flex-col items-center border-2 transition-all cursor-pointer ${
                    selectedPieceId
                      ? 'border-amber-400 hover:scale-105 bg-amber-500/10'
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span className="text-4xl mb-1">{char.avatar}</span>
                  <span className="font-extrabold text-sm text-slate-200">{char.name}</span>
                  <div className="w-full min-h-24 bg-slate-950/80 rounded-2xl p-2 mt-2 flex flex-wrap justify-center items-center gap-1 border border-slate-800">
                    {charPieces.map((c) => (
                      <CookieItem
                        key={c.id}
                        type={c.type}
                        size={42}
                        selected={selectedPieceId === c.id}
                        onClick={() => handleCookieClick(c)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Equitable options trigger */}
          <AnimatePresence>
            {isEquitable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-emerald-950/90 border-2 border-emerald-500 p-5 rounded-3xl text-center shadow-xl my-2"
              >
                <div className="flex items-center justify-center gap-2 mb-2 text-emerald-300 font-extrabold text-lg">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>¡Reparto equitativo completado!</span>
                </div>
                <p className="font-bold text-slate-100 mb-4">
                  ¿Cuántas galletas recibió cada amigo/a en su plato?
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {exercise.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect(opt)}
                      className="btn-touch bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-base md:text-lg shadow-lg active:scale-95 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Animation Overlay */}
          {isSuccess && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6 text-center"
            >
              <div className="text-7xl mb-4 animate-bounce">⭐</div>
              <h2 className="text-3xl font-extrabold text-amber-400 mb-2">¡Excelente Trabajo!</h2>
              <p className="text-lg text-slate-200">¡Obtuviste una Estrella para tu Perfil!</p>
            </motion.div>
          )}
        </main>
      ) : (
        /* Fallback Explicativo (al alcanzar 10 errores sin mostrar contador estresante) */
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
