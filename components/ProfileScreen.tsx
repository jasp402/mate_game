'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Profile } from '@/lib/gameData';
import { sounds } from '@/lib/sound';
import { User, GraduationCap, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ProfileScreenProps {
  initialProfile: Profile | null;
  onSaveProfile: (profile: Profile) => void;
}

const AVATAR_OPTIONS = [
  { id: 'nino', emoji: '👦🏻', label: 'Niño' },
  { id: 'nina', emoji: '👧🏻', label: 'Niña' },
  { id: 'robot', emoji: '🤖', label: 'Robot' },
  { id: 'alien', emoji: '👽', label: 'Alien' },
  { id: 'perro', emoji: '🐶', label: 'Perro' },
  { id: 'gato', emoji: '🐱', label: 'Gato' },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ initialProfile, onSaveProfile }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(initialProfile?.name || '');
  const [avatar, setAvatar] = useState(initialProfile?.avatar || '👦🏻');
  const [grade, setGrade] = useState(initialProfile?.grade || 1);

  const handleNextStep = () => {
    sounds.playPop();
    if (step === 1) {
      if (!name.trim()) setName('Aventurero');
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    sounds.playPop();
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleFinish = () => {
    sounds.playSuccess();
    onSaveProfile({
      name: name.trim() || 'Aventurero',
      avatar,
      grade,
    });
  };

  return (
    <div className="p-6 flex flex-col justify-between min-h-screen bg-slate-900 text-white max-w-xl mx-auto selection:bg-amber-500 overflow-hidden">
      {/* Wizard Header / Indicator */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600/30 p-2 rounded-2xl border border-indigo-500/40">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <span className="font-extrabold text-slate-200 text-lg">Perfil de Juego</span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  step === i
                    ? 'w-8 bg-amber-400'
                    : step > i
                    ? 'w-2.5 bg-emerald-500'
                    : 'w-2.5 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Content Card with Transitions */}
      <div className="my-auto py-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-800/80 border-2 border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center"
            >
              <div className="bg-amber-500/20 p-4 rounded-full mb-3 text-amber-400">
                <User className="w-8 h-8" />
              </div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Paso 1 de 3</p>
              <h2 className="text-2xl font-black mb-4 text-slate-100">¿Cómo te llamas?</h2>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleNextStep();
                  }
                }}
                placeholder="Escribe tu nombre..."
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-2xl px-5 py-4 text-center text-2xl font-bold text-white outline-none transition-colors mb-6"
                maxLength={18}
                autoFocus
              />

              <button
                onClick={handleNextStep}
                className="w-full btn-touch bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-800/80 border-2 border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center"
            >
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Paso 2 de 3</p>
              <h2 className="text-2xl font-black mb-4 text-slate-100">Elige tu Avatar</h2>

              {/* 6 Avatar Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mb-6">
                {AVATAR_OPTIONS.map((opt) => {
                  const isSelected = avatar === opt.emoji;
                  return (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={opt.id}
                      onClick={() => {
                        sounds.playPop();
                        setAvatar(opt.emoji);
                      }}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 shadow-lg ring-2 ring-amber-400/50'
                          : 'border-slate-700 bg-slate-900/60 hover:bg-slate-700/60'
                      }`}
                    >
                      <span className="text-5xl mb-1">{opt.emoji}</span>
                      <span className="font-extrabold text-sm text-slate-200">{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handlePrevStep}
                  className="btn-touch px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-2xl flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Atrás</span>
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 btn-touch bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-800/80 border-2 border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center"
            >
              <div className="bg-indigo-500/20 p-4 rounded-full mb-3 text-indigo-400">
                <GraduationCap className="w-8 h-8" />
              </div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Paso 3 de 3</p>
              <h2 className="text-2xl font-black mb-4 text-slate-100">¿En qué grado estás?</h2>

              <div className="grid grid-cols-3 gap-3 w-full mb-6">
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => {
                      sounds.playPop();
                      setGrade(g);
                    }}
                    className={`btn-touch font-black text-xl rounded-2xl border-2 transition-all ${
                      grade === g
                        ? 'bg-indigo-600 border-amber-400 text-white shadow-lg'
                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    {g}.º Grado
                  </button>
                ))}
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handlePrevStep}
                  className="btn-touch px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-2xl flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Atrás</span>
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 btn-touch bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xl py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>¡Comenzar!</span>
                  <CheckCircle2 className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <div className="text-center text-xs text-slate-500 pb-2 font-medium">
        Progreso guardado automáticamente en este dispositivo
      </div>
    </div>
  );
};

