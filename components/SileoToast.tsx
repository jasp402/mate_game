'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X, Sparkles, CheckCircle, Info } from 'lucide-react';

export interface ToastProps {
  message: string | null;
  onClose: () => void;
  type?: 'warning' | 'info' | 'success' | 'error';
  durationMs?: number;
}

export const SileoToast: React.FC<ToastProps> = ({
  message,
  onClose,
  type = 'warning',
  durationMs = 10000, // 10 seconds as requested
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [message, durationMs, onClose]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />;
      case 'info':
        return <Info className="w-6 h-6 text-sky-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />;
      case 'warning':
      default:
        return <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/80 bg-slate-900/95 text-emerald-100 ring-1 ring-emerald-500/30';
      case 'info':
        return 'border-sky-500/80 bg-slate-900/95 text-sky-100 ring-1 ring-sky-500/30';
      case 'error':
        return 'border-rose-500/80 bg-slate-900/95 text-rose-100 ring-1 ring-rose-500/30';
      case 'warning':
      default:
        return 'border-amber-500/80 bg-slate-900/95 text-amber-100 ring-1 ring-amber-500/30';
    }
  };

  const getProgressBarColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-400';
      case 'info':
        return 'bg-sky-400';
      case 'error':
        return 'bg-rose-400';
      case 'warning':
      default:
        return 'bg-amber-400';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`pointer-events-auto relative overflow-hidden border-2 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center gap-3.5 ${getColors()}`}
        >
          {getIcon()}

          <div className="flex-1 text-sm md:text-base font-bold leading-snug pr-2">
            {message}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label="Cerrar notificación"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 10-second Sileo linear progress timer */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: durationMs / 1000, ease: 'linear' }}
            className={`absolute bottom-0 left-0 h-1.5 ${getProgressBarColor()}`}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
