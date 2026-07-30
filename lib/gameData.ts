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
  isStory: boolean; // Odd = true (Story + characters + objects), Even = false (Direct numerical operation)
  storyText?: string;
  characterAvatar?: string;
  characterName?: string;
  instruction: string;
  itemType: 'apples' | 'stars' | 'candies' | 'blocks' | 'pizzas' | 'toys';
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

// Standard math exercises generator following strict 5-pair structure:
// Odd (1, 3, 5, 7, 9) = Story, character & interactive objects
// Even (2, 4, 6, 8, 10) = Direct math operation testing the concept with similar values
export function getStandardExercises(op: OperationType, grade: number): StandardMathExercise[] {
  // Base configuration per pair for each operation
  let pairsConfig: {
    storyText: string;
    characterName: string;
    characterAvatar: string;
    itemType: StandardMathExercise['itemType'];
    numA: number;
    numB: number;
    operator: '+' | '-' | '×' | '÷';
  }[] = [];

  const gradeMult = Math.max(1, grade <= 2 ? 1 : grade <= 4 ? 1.5 : 2);

  if (op === 'subtraction') {
    pairsConfig = [
      {
        storyText: 'Mateo tenía 5 bloques de construcción. Usa tu martillo 🔨 para romper 2 bloques. ¿Cuántos bloques enteros le quedan?',
        characterName: 'Mateo',
        characterAvatar: '👦🏼',
        itemType: 'blocks',
        numA: Math.round(5 * gradeMult),
        numB: Math.round(2 * gradeMult),
        operator: '-',
      },
      {
        storyText: 'Sofía compró 7 manzanas rojas y se comió 3 con sus amigos. ¿Cuántas manzanas le quedan?',
        characterName: 'Sofía',
        characterAvatar: '👧🏽',
        itemType: 'apples',
        numA: Math.round(7 * gradeMult),
        numB: Math.round(3 * gradeMult),
        operator: '-',
      },
      {
        storyText: 'Lucas tenía 9 dulces en una bolsa y le regaló 4 a su hermana. ¿Cuántos dulces le quedan?',
        characterName: 'Lucas',
        characterAvatar: '👦🏽',
        itemType: 'candies',
        numA: Math.round(9 * gradeMult),
        numB: Math.round(4 * gradeMult),
        operator: '-',
      },
      {
        storyText: 'Elena armó una estructura de 8 bloques. Con su martillo 🔨 derribó 5 bloques. ¿Cuántos bloques sanos quedan?',
        characterName: 'Elena',
        characterAvatar: '👧🏻',
        itemType: 'blocks',
        numA: Math.round(8 * gradeMult),
        numB: Math.round(5 * gradeMult),
        operator: '-',
      },
      {
        storyText: 'Mateo tenía 10 galletas en la mesa y se comieron 6 en la merienda. ¿Cuántas galletas le quedan?',
        characterName: 'Mateo',
        characterAvatar: '👦🏼',
        itemType: 'toys',
        numA: Math.round(10 * gradeMult),
        numB: Math.round(6 * gradeMult),
        operator: '-',
      },
    ];
  } else if (op === 'addition') {
    pairsConfig = [
      {
        storyText: 'Sofía tenía 4 manzanas y Mateo le regaló 3 manzanas más. ¿Cuántas manzanas tienen en total?',
        characterName: 'Sofía',
        characterAvatar: '👧🏽',
        itemType: 'apples',
        numA: Math.round(4 * gradeMult),
        numB: Math.round(3 * gradeMult),
        operator: '+',
      },
      {
        storyText: 'Mateo recolectó 6 estrellas y luego consiguió 2 estrellas más. ¿Cuántas estrellas tiene ahora?',
        characterName: 'Mateo',
        characterAvatar: '👦🏼',
        itemType: 'stars',
        numA: Math.round(6 * gradeMult),
        numB: Math.round(2 * gradeMult),
        operator: '+',
      },
      {
        storyText: 'Lucas colocó 5 bloques y Elena agregó 4 bloques más arriba. ¿Cuántos bloques hay en total?',
        characterName: 'Lucas',
        characterAvatar: '👦🏽',
        itemType: 'blocks',
        numA: Math.round(5 * gradeMult),
        numB: Math.round(4 * gradeMult),
        operator: '+',
      },
      {
        storyText: 'Elena tenía 8 dulces y su mamá le dio 3 dulces más. ¿Cuántos dulces tiene en total?',
        characterName: 'Elena',
        characterAvatar: '👧🏻',
        itemType: 'candies',
        numA: Math.round(8 * gradeMult),
        numB: Math.round(3 * gradeMult),
        operator: '+',
      },
      {
        storyText: 'Mateo tenía 7 juguetes y su papá le regaló 5 juguetes más. ¿Cuántos juguetes tiene ahora?',
        characterName: 'Mateo',
        characterAvatar: '👦🏼',
        itemType: 'toys',
        numA: Math.round(7 * gradeMult),
        numB: Math.round(5 * gradeMult),
        operator: '+',
      },
    ];
  } else if (op === 'multiplication') {
    pairsConfig = [
      {
        storyText: 'Sofía tiene 3 cajas y cada caja contiene 2 manzanas. ¿Cuántas manzanas hay en total?',
        characterName: 'Sofía',
        characterAvatar: '👧🏽',
        itemType: 'apples',
        numA: 3,
        numB: 2,
        operator: '×',
      },
      {
        storyText: 'Mateo colocó 4 bolsas con 3 dulces en cada una. ¿Cuántos dulces hay en total?',
        characterName: 'Mateo',
        characterAvatar: '👦🏼',
        itemType: 'candies',
        numA: 4,
        numB: 3,
        operator: '×',
      },
      {
        storyText: 'Lucas organizó 2 filas con 5 bloques cada una. ¿Cuántos bloques hay en total?',
        characterName: 'Lucas',
        characterAvatar: '👦🏽',
        itemType: 'blocks',
        numA: 2,
        numB: 5,
        operator: '×',
      },
      {
        storyText: 'Elena juntó 5 sobres con 4 estrellas en cada sobre. ¿Cuántas estrellas reunió?',
        characterName: 'Elena',
        characterAvatar: '👧🏻',
        itemType: 'stars',
        numA: 5,
        numB: 4,
        operator: '×',
      },
      {
        storyText: 'Mateo tiene 3 platos con 6 galletas en cada plato. ¿Cuántas galletas hay en total?',
        characterName: 'Mateo',
        characterAvatar: '👦🏼',
        itemType: 'toys',
        numA: 3,
        numB: 6,
        operator: '×',
      },
    ];
  } else {
    // Division
    pairsConfig = [
      {
        storyText: 'Sofía tiene 6 pizzas para repartir equitativamente entre 2 amigos. ¿Cuántas pizzas le tocan a cada uno?',
        characterName: 'Sofía',
        characterAvatar: '👧🏽',
        itemType: 'pizzas',
        numA: 6,
        numB: 2,
        operator: '÷',
      },
      {
        storyText: 'Mateo tiene 8 dulces para compartir por igual entre 4 compañeros. ¿Cuántos recibe cada uno?',
        characterName: 'Mateo',
        characterAvatar: '👦🏼',
        itemType: 'candies',
        numA: 8,
        numB: 4,
        operator: '÷',
      },
      {
        storyText: 'Lucas tiene 12 bloques y forma 3 grupos iguales. ¿Cuántos bloques tiene cada grupo?',
        characterName: 'Lucas',
        characterAvatar: '👦🏽',
        itemType: 'blocks',
        numA: 12,
        numB: 3,
        operator: '÷',
      },
      {
        storyText: 'Elena tiene 10 manzanas para repartir por igual entre 2 amigos. ¿Cuántas le da a cada uno?',
        characterName: 'Elena',
        characterAvatar: '👧🏻',
        itemType: 'apples',
        numA: 10,
        numB: 2,
        operator: '÷',
      },
      {
        storyText: 'Mateo guardó 15 estrellas repartidas por igual en 5 cajas. ¿Cuántas estrellas hay por caja?',
        characterName: 'Mateo',
        characterAvatar: '👦🏼',
        itemType: 'stars',
        numA: 15,
        numB: 5,
        operator: '÷',
      },
    ];
  }

  const exercises: StandardMathExercise[] = [];

  // Generate 10 exercises organized in 5 pairs
  for (let pairIndex = 0; pairIndex < 5; pairIndex++) {
    const config = pairsConfig[pairIndex];
    const numA = config.numA;
    const numB = config.numB;
    const operator = config.operator;

    let correct = 0;
    if (operator === '+') correct = numA + numB;
    if (operator === '-') correct = numA - numB;
    if (operator === '×') correct = numA * numB;
    if (operator === '÷') correct = Math.floor(numA / numB);

    // Options generator
    const generateOptions = (ans: number) => {
      const opts = new Set<number>([ans]);
      opts.add(Math.max(0, ans + 1));
      opts.add(Math.max(0, ans - 1));
      if (opts.size < 3) opts.add(ans + 2);
      if (opts.size < 3) opts.add(Math.max(0, ans - 2));
      return Array.from(opts).sort((a, b) => a - b);
    };

    const options = generateOptions(correct);

    // Ejercicio Impar (1, 3, 5, 7, 9): Historia + Objetos + Personaje
    const oddId = pairIndex * 2 + 1;
    exercises.push({
      id: oddId,
      title: `Ejercicio ${oddId}: Historia con ${config.characterName}`,
      isStory: true,
      storyText: config.storyText,
      characterName: config.characterName,
      characterAvatar: config.characterAvatar,
      instruction: `Lee la historia de ${config.characterName}, interactúa con los objetos y responde correctamente.`,
      itemType: config.itemType,
      numA,
      numB,
      operator,
      options,
      correctAnswer: correct,
      explanation: `Tenías ${numA} ${operator === '-' ? 'objetos y quitaste' : operator === '+' ? 'objetos y agregaste' : 'objetos y dividiste/multiplicaste'} ${numB}. El resultado es ${correct}.`,
    });

    // Ejercicio Par (2, 4, 6, 8, 10): Operación Directa sin historia para comprobar comprensión
    const evenId = pairIndex * 2 + 2;
    exercises.push({
      id: evenId,
      title: `Ejercicio ${evenId}: Comprueba lo aprendido (${numA} ${operator} ${numB})`,
      isStory: false,
      instruction: `Demuestra lo aprendido resolviendo directamente la operación numérica: ${numA} ${operator} ${numB} = ?`,
      itemType: config.itemType,
      numA,
      numB,
      operator,
      options,
      correctAnswer: correct,
      explanation: `${numA} ${operator} ${numB} es igual a ${correct}.`,
    });
  }

  return exercises;
}
