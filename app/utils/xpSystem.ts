import { Exercise, XPFormula, SessionSet } from '../types';

// Fórmula base de XP para solo leveling
export const XP_FORMULA: XPFormula = {
    baseXP: 10,
    weightMultiplier: 0.1,
    repsMultiplier: 0.5,
    setsMultiplier: 1.0,
    streakBonus: 0.2,
    levelBonus: 0.1
};

// XP necessário para cada nível (cresce exponencialmente)
export const calculateXPForLevel = (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Calcular XP para um set específico
export const calculateSetXP = (
    weight: number,
    reps: number,
    currentLevel: number,
    streak: number
): number => {
    let xp = XP_FORMULA.baseXP;
    
    // Bônus por peso (quanto mais peso, mais XP)
    xp += weight * XP_FORMULA.weightMultiplier;
    
    // Bônus por repetições
    xp += reps * XP_FORMULA.repsMultiplier;
    
    // Bônus por nível atual (níveis mais altos dão mais XP)
    xp += currentLevel * XP_FORMULA.levelBonus;
    
    // Bônus por streak (sequência de treinos)
    xp += streak * XP_FORMULA.streakBonus;
    
    return Math.floor(xp);
};

// Calcular XP total para um exercício
export const calculateExerciseXP = (sets: SessionSet[]): number => {
    return sets.reduce((total, set) => total + set.xp, 0);
};

// Verificar se subiu de nível
export const checkLevelUp = (exercise: Exercise): { leveledUp: boolean; newLevel: number; xpRemaining: number } => {
    const xpNeeded = calculateXPForLevel(exercise.currentLevel + 1);
    
    if (exercise.currentXP >= xpNeeded) {
        const newLevel = exercise.currentLevel + 1;
        const xpRemaining = exercise.currentXP - xpNeeded;
        return { leveledUp: true, newLevel, xpRemaining };
    }
    
    return { leveledUp: false, newLevel: exercise.currentLevel, xpRemaining: exercise.currentXP };
};

// Calcular progresso para o próximo nível (0-100%)
export const calculateLevelProgress = (exercise: Exercise): number => {
    const currentLevelXP = calculateXPForLevel(exercise.currentLevel);
    const nextLevelXP = calculateXPForLevel(exercise.currentLevel + 1);
    const xpInCurrentLevel = exercise.currentXP - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    
    return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));
};

// Calcular XP total necessário para o próximo nível
export const calculateXPToNextLevel = (exercise: Exercise): number => {
    const currentLevelXP = calculateXPForLevel(exercise.currentLevel);
    const nextLevelXP = calculateXPForLevel(exercise.currentLevel + 1);
    return nextLevelXP - exercise.currentXP;
};

// Sistema de conquistas baseado em XP
export const getAchievements = (totalXP: number): string[] => {
    const achievements: string[] = [];
    
    if (totalXP >= 1000) achievements.push("Iniciante");
    if (totalXP >= 5000) achievements.push("Dedicado");
    if (totalXP >= 10000) achievements.push("Consistente");
    if (totalXP >= 25000) achievements.push("Determinado");
    if (totalXP >= 50000) achievements.push("Viciado");
    if (totalXP >= 100000) achievements.push("Lendário");
    
    return achievements;
};

// Calcular bônus de streak
export const calculateStreakBonus = (streak: number): number => {
    if (streak >= 7) return 0.5;  // 50% de bônus para 7+ dias
    if (streak >= 3) return 0.25; // 25% de bônus para 3+ dias
    return 0;
};
