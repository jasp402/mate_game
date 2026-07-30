'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Profile,
  OperationType,
  ExerciseProgress,
  COOKIE_EXERCISES,
  getStandardExercises,
} from '@/lib/gameData';
import { ProfileScreen } from '@/components/ProfileScreen';
import { HomeScreen } from '@/components/HomeScreen';
import { GridScreen } from '@/components/GridScreen';
import { CookieGame } from '@/components/CookieGame';
import { StandardMathGame } from '@/components/StandardMathGame';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [screen, setScreen] = useState<'profile' | 'home' | 'grid' | 'game'>('profile');

  const [activeOp, setActiveOp] = useState<OperationType>('division');
  const [activeExId, setActiveExId] = useState<number>(1);

  // Exercise state per operation
  const [exercisesMap, setExercisesMap] = useState<Record<OperationType, ExerciseProgress[]>>(() => ({
    addition: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, status: i === 0 ? ('available' as const) : ('locked' as const), failedAttempts: 0 })),
    subtraction: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, status: i === 0 ? ('available' as const) : ('locked' as const), failedAttempts: 0 })),
    multiplication: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, status: i === 0 ? ('available' as const) : ('locked' as const), failedAttempts: 0 })),
    division: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, status: i === 0 ? ('available' as const) : ('locked' as const), failedAttempts: 0 })),
  }));

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('math_profile');
      const savedExercises = localStorage.getItem('math_exercises_v2');
      if (savedProfile || savedExercises) {
        queueMicrotask(() => {
          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
            setScreen('home');
          }
          if (savedExercises) {
            setExercisesMap(JSON.parse(savedExercises));
          }
        });
      }
    } catch {
      // Fallback
    }
  }, []);

  // Sync exercises to localStorage
  const updateExercisesMap = (newMap: Record<OperationType, ExerciseProgress[]>) => {
    setExercisesMap(newMap);
    if (typeof window !== 'undefined') {
      localStorage.setItem('math_exercises_v2', JSON.stringify(newMap));
    }
  };

  const handleSaveProfile = (p: Profile) => {
    setProfile(p);
    if (typeof window !== 'undefined') {
      localStorage.setItem('math_profile', JSON.stringify(p));
    }
    setScreen('home');
  };

  const currentOpExercises = exercisesMap[activeOp] || [];
  const hasUnfinished = currentOpExercises.some((e) => e.status === 'available');

  // Total stars across all operations
  const totalStars = Object.values(exercisesMap)
    .flat()
    .filter((e) => e.status === 'completed').length;

  const handleExerciseComplete = (isFallback: boolean) => {
    const updated = currentOpExercises.map((ex) => {
      if (ex.id === activeExId) {
        return { ...ex, status: isFallback ? ('fallback' as const) : ('completed' as const) };
      }
      return ex;
    });

    // Unlock next exercise if locked
    const currentIdx = updated.findIndex((e) => e.id === activeExId);
    if (currentIdx !== -1 && currentIdx + 1 < updated.length) {
      if (updated[currentIdx + 1].status === 'locked') {
        updated[currentIdx + 1].status = 'available';
      }
    }

    const newMap = { ...exercisesMap, [activeOp]: updated };
    updateExercisesMap(newMap);
    setScreen('grid');
  };

  const handleContinue = () => {
    const avail = currentOpExercises.find((e) => e.status === 'available');
    if (avail) {
      setActiveExId(avail.id);
      setScreen('game');
    } else {
      setScreen('grid');
    }
  };

  return (
    <div
      className="relative min-h-screen w-full bg-slate-950 bg-cover bg-center bg-no-repeat bg-fixed text-slate-100 flex flex-col justify-between selection:bg-amber-500 overflow-x-hidden"
      style={{ backgroundImage: `url('${basePath}/math_bg.svg')` }}
    >
      <AnimatePresence mode="wait">
        {screen === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full flex-1"
          >
            <ProfileScreen initialProfile={profile} onSaveProfile={handleSaveProfile} />
          </motion.div>
        )}

        {screen === 'home' && profile && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full flex-1"
          >
            <HomeScreen
              profile={profile}
              totalStars={totalStars}
              hasUnfinished={hasUnfinished}
              onOpenProfile={() => setScreen('profile')}
              onSelectOperation={(op) => {
                setActiveOp(op);
                setScreen('grid');
              }}
              onContinue={handleContinue}
            />
          </motion.div>
        )}

        {screen === 'grid' && profile && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full flex-1"
          >
            <GridScreen
              operation={activeOp}
              grade={profile.grade}
              exercises={currentOpExercises}
              onBack={() => setScreen('home')}
              onSelectExercise={(id) => {
                setActiveExId(id);
                setScreen('game');
              }}
            />
          </motion.div>
        )}

        {screen === 'game' && profile && (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full flex-1"
          >
            {activeOp === 'division' ? (
              <CookieGame
                exercise={COOKIE_EXERCISES[(activeExId - 1) % COOKIE_EXERCISES.length]}
                onBack={() => setScreen('grid')}
                onComplete={handleExerciseComplete}
              />
            ) : (
              <StandardMathGame
                key={`${activeOp}_${activeExId}`}
                exercise={
                  getStandardExercises(activeOp, profile.grade)[
                    (activeExId - 1) % 10
                  ]
                }
                onBack={() => setScreen('grid')}
                onComplete={handleExerciseComplete}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

