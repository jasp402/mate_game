export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface Profile {
  name: string;
  avatar: string;
  grade: number; // 1 - 6
}

export type ExerciseStatus = 'locked' | 'available' | 'completed' | 'fallback';

export interface ExerciseProgress {
  id: number;
  status: ExerciseStatus;
  failedAttempts: number;
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
}

export interface CookieExerciseConfig {
  id: number;
  title: string;
  instruction: string;
  initialCookies: number; // e.g. 5
  characters: Character[];
  targetFractionText: string; // e.g. "Dos y medio"
  correctValue: number; // e.g. 2.5
  options: string[]; // ["Dos", "Dos y medio", "Tres"]
  explanation: string;
}

export interface StandardMathExercise {
  id: number;
  title: string;
  instruction: string;
  itemType: 'apples' | 'stars' | 'candies' | 'blocks' | 'pizzas';
  numA: number;
  numB: number;
  operator: '+' | '-' | '×' | '÷';
  options: number[];
  correctAnswer: number;
  explanation: string;
}

export const OPERATION_METADATA: Record<OperationType, { name: string; icon: string; color: string; bg: string }> = {
  addition: { name: 'Suma', icon: '🧮', color: 'emerald', bg: 'bg-emerald-600' },
  subtraction: { name: 'Resta', icon: '➖', color: 'amber', bg: 'bg-amber-600' },
  multiplication: { name: 'Multiplicación', icon: '✖️', color: 'blue', bg: 'bg-blue-600' },
  division: { name: 'División y Fracciones', icon: '➗', color: 'purple', bg: 'bg-purple-600' },
};

export const DEFAULT_CHARACTERS: Character[] = [
  { id: 'char1', name: 'Sofía', avatar: '👧🏽' },
  { id: 'char2', name: 'Mateo', avatar: '👦🏼' },
  { id: 'char3', name: 'Elena', avatar: '👧🏻' },
  { id: 'char4', name: 'Lucas', avatar: '👦🏽' },
];

// 10 cookie/fraction exercises for Division/Fracciones
export const COOKIE_EXERCISES: CookieExerciseConfig[] = [
  {
    id: 1,
    title: 'Ejercicio 1: Reparto de Galletas',
    instruction: 'Corta las galletas necesarias por la mitad y repártelas en partes iguales entre Sofía y Mateo.',
    initialCookies: 5,
    characters: [DEFAULT_CHARACTERS[0], DEFAULT_CHARACTERS[1]],
    targetFractionText: 'Dos y medio',
    correctValue: 2.5,
    options: ['Dos', 'Dos y medio', 'Tres'],
    explanation: 'Tenías 5 galletas para 2 personas. Cada persona recibe 2 galletas enteras y 1 mitad (2 + 1/2 = Dos y medio).'
  },
  {
    id: 2,
    title: 'Ejercicio 2: Galletas entre 2 amigos',
    instruction: 'Tienes 3 galletas enteras para repartir por igual entre Sofía y Mateo. ¡Corta lo necesario!',
    initialCookies: 3,
    characters: [DEFAULT_CHARACTERS[0], DEFAULT_CHARACTERS[1]],
    targetFractionText: 'Uno y medio',
    correctValue: 1.5,
    options: ['Uno', 'Uno y medio', 'Dos'],
    explanation: 'Tenías 3 galletas para 2 personas. Cada persona recibe 1 galleta entera y 1 mitad (1 + 1/2 = Uno y medio).'
  },
  {
    id: 3,
    title: 'Ejercicio 3: Cuartos de Galleta',
    instruction: 'Reparte 1 galleta entera entre 4 amigos (Sofía, Mateo, Elena y Lucas) cortándola en cuartos (1/4).',
    initialCookies: 1,
    characters: DEFAULT_CHARACTERS,
    targetFractionText: 'Un cuarto',
    correctValue: 0.25,
    options: ['Un medio', 'Un cuarto', 'Tres cuartos'],
    explanation: 'Una galleta dividida en 4 partes iguales le da a cada persona 1 cuarto (1/4).'
  },
  {
    id: 4,
    title: 'Ejercicio 4: Reparto entre 4 amigos',
    instruction: 'Tienes 5 galletas para repartir equitativamente entre 4 amigos.',
    initialCookies: 5,
    characters: DEFAULT_CHARACTERS,
    targetFractionText: 'Uno y un cuarto',
    correctValue: 1.25,
    options: ['Uno', 'Uno y un cuarto', 'Uno y medio'],
    explanation: '5 galletas entre 4 personas: cada uno recibe 1 galleta entera y 1 cuarto (1 + 1/4 = Uno y un cuarto).'
  },
  {
    id: 5,
    title: 'Ejercicio 5: Galletas para tres',
    instruction: 'Reparte 7 galletas por igual entre Sofía, Mateo y Elena.',
    initialCookies: 7,
    characters: [DEFAULT_CHARACTERS[0], DEFAULT_CHARACTERS[1], DEFAULT_CHARACTERS[2]],
    targetFractionText: 'Dos y un tercio',
    correctValue: 2.33,
    options: ['Dos', 'Dos y un tercio', 'Tres'],
    explanation: '7 galletas entre 3 personas: cada una recibe 2 galletas enteras y 1 tercio (2 + 1/3).'
  },
  {
    id: 6,
    title: 'Ejercicio 6: 2 Galletas entre 4 personas',
    instruction: 'Reparte 2 galletas enteras en partes iguales entre 4 personas.',
    initialCookies: 2,
    characters: DEFAULT_CHARACTERS,
    targetFractionText: 'Un medio',
    correctValue: 0.5,
    options: ['Un cuarto', 'Un medio', 'Uno entero'],
    explanation: '2 galletas divididas entre 4 personas le dan 1 mitad (1/2) a cada persona.'
  },
  {
    id: 7,
    title: 'Ejercicio 7: Gran Meriendita',
    instruction: 'Tienes 9 galletas para repartir equitativamente entre Sofía y Mateo.',
    initialCookies: 9,
    characters: [DEFAULT_CHARACTERS[0], DEFAULT_CHARACTERS[1]],
    targetFractionText: 'Cuatro y medio',
    correctValue: 4.5,
    options: ['Cuatro', 'Cuatro y medio', 'Cinco'],
    explanation: '9 galletas entre 2 personas: 4 galletas enteras y 1 mitad para cada uno (4 + 1/2).'
  },
  {
    id: 8,
    title: 'Ejercicio 8: Fiesta de Galletas',
    instruction: 'Tienes 3 galletas para repartir entre 4 amigos. ¿Cuánto le toca a cada uno?',
    initialCookies: 3,
    characters: DEFAULT_CHARACTERS,
    targetFractionText: 'Tres cuartos',
    correctValue: 0.75,
    options: ['Un medio', 'Tres cuartos', 'Uno entero'],
    explanation: '3 galletas entre 4 personas: cada persona recibe 3 cuartos (3/4) de galleta.'
  },
  {
    id: 9,
    title: 'Ejercicio 9: Reparto de 6 Galletas',
    instruction: 'Reparte 6 galletas entre 4 amigos usando cortes en mitades y cuartos.',
    initialCookies: 6,
    characters: DEFAULT_CHARACTERS,
    targetFractionText: 'Uno y medio',
    correctValue: 1.5,
    options: ['Uno', 'Uno y medio', 'Dos'],
    explanation: '6 galletas entre 4 personas: 1 galleta entera y 1 mitad (1.5) para cada amigo.'
  },
  {
    id: 10,
    title: 'Ejercicio 10: Reto Final de Galletas',
    instruction: 'Tienes 11 galletas para 2 amigos. ¡Encuentra el reparto exacto e igual!',
    initialCookies: 11,
    characters: [DEFAULT_CHARACTERS[0], DEFAULT_CHARACTERS[1]],
    targetFractionText: 'Cinco y medio',
    correctValue: 5.5,
    options: ['Cinco', 'Cinco y medio', 'Seis'],
    explanation: '11 galletas entre 2 personas: 5 galletas enteras y 1 mitad (5.5) para cada amigo.'
  },
];

// Standard math exercises generator according to grade level & operation
export function getStandardExercises(op: OperationType, grade: number): StandardMathExercise[] {
  const exercises: StandardMathExercise[] = [];
  
  for (let i = 1; i <= 10; i++) {
    let numA = 0;
    let numB = 0;
    let operator: '+' | '-' | '×' | '÷' = '+';
    let itemType: StandardMathExercise['itemType'] = 'apples';

    if (op === 'addition') {
      operator = '+';
      itemType = i % 2 === 0 ? 'apples' : 'stars';
      const max = grade === 1 ? 10 : grade === 2 ? 20 : 50;
      numB = Math.floor(Math.random() * (max / 2)) + 1 + i;
      numA = Math.floor(Math.random() * (max / 2)) + 2 + i;
    } else if (op === 'subtraction') {
      operator = '-';
      itemType = i % 2 === 0 ? 'candies' : 'blocks';
      const max = grade === 1 ? 10 : grade === 2 ? 20 : 40;
      numB = Math.floor(Math.random() * (max / 2)) + 1;
      numA = numB + Math.floor(Math.random() * (max / 2)) + 1;
    } else if (op === 'multiplication') {
      operator = '×';
      itemType = 'stars';
      const factorMax = grade <= 2 ? 5 : grade <= 4 ? 9 : 12;
      numA = (i % factorMax) + 1;
      numB = Math.floor(Math.random() * 5) + 2;
    } else {
      operator = '÷';
      itemType = 'pizzas';
      numB = (i % 4) + 2;
      numA = numB * (Math.floor(Math.random() * 4) + 1);
    }

    let correct = 0;
    if (operator === '+') correct = numA + numB;
    if (operator === '-') correct = numA - numB;
    if (operator === '×') correct = numA * numB;
    if (operator === '÷') correct = numA / numB;

    const wrong1 = correct + (i % 2 === 0 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
    const wrong2 = correct + (i % 2 === 0 ? -2 : 2) * (Math.floor(Math.random() * 3) + 1);
    
    // Sort options uniquely
    const optionsSet = new Set([correct, wrong1, wrong2]);
    while (optionsSet.size < 3) {
      optionsSet.add(correct + Math.floor(Math.random() * 10) - 5);
    }
    const options = Array.from(optionsSet).sort((a, b) => a - b);

    exercises.push({
      id: i,
      title: `Ejercicio ${i}`,
      instruction: `Resuelve el problema visual contando los elementos o realizando la operación.`,
      itemType,
      numA,
      numB,
      operator,
      options,
      correctAnswer: correct,
      explanation: `${numA} ${operator} ${numB} es igual a ${correct}.`
    });
  }

  return exercises;
}
