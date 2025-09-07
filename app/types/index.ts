export interface Exercise {
    id: string;
    name: string;
    category: string;
    currentLevel: number;
    currentXP: number;
    xpToNextLevel: number;
    totalXP: number;
    maxWeight: number;
    maxReps: number;
    maxSets: number;
    lastPerformed: Date | null;
    streak: number;
}

export interface Workout {
    id: string;
    name: string;
    dayOfWeek: number; // 0 = Domingo, 1 = Segunda, etc.
    exercises: WorkoutExercise[];
    isActive: boolean;
    createdAt: Date;
}

export interface WorkoutExercise {
    exerciseId: string;
    sets: number;
    reps: number;
    weight: number;
    restTime: number; // em segundos
}

export interface WorkoutSession {
    id: string;
    workoutId: string;
    date: Date;
    exercises: SessionExercise[];
    totalXP: number;
    duration: number; // em minutos
    notes: string;
}

export interface SessionExercise {
    exerciseId: string;
    sets: SessionSet[];
    totalXP: number;
}

export interface SessionSet {
    setNumber: number;
    reps: number;
    weight: number;
    xp: number;
    completed: boolean;
}

export interface UserStats {
    totalLevel: number;
    totalXP: number;
    totalWorkouts: number;
    currentStreak: number;
    longestStreak: number;
    favoriteExercise: string;
    totalTime: number; // em minutos
    achievements: Achievement[];
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt: Date | null;
    xpReward: number;
}

export interface XPFormula {
    baseXP: number;
    weightMultiplier: number;
    repsMultiplier: number;
    setsMultiplier: number;
    streakBonus: number;
    levelBonus: number;
}
