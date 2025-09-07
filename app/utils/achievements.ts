export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'first_time' | 'progress' | 'streak' | 'milestone' | 'special';
    unlocked: boolean;
    unlockedAt?: Date;
    progress?: number;
    maxProgress?: number;
}

export interface AchievementProgress {
    totalWorkouts: number;
    totalExercises: number;
    currentStreak: number;
    longestStreak: number;
    totalLevels: number;
    totalXP: number;
    workoutsThisWeek: number;
    lastWorkoutDate?: Date;
    exerciseLevelUps: number;
    weightIncreases: number;
    consecutiveWorkoutDays: number;
    firstWorkoutDate?: Date;
    firstExerciseDate?: Date;
}

// Sistema de conquistas baseado em ações
export const ACHIEVEMENTS: Achievement[] = [
    // CONQUISTAS DE PRIMEIRA VEZ
    {
        id: 'first_exercise',
        name: 'Primeiro Exercício',
        description: 'Adicione seu primeiro exercício',
        icon: '💪',
        category: 'first_time',
        unlocked: false
    },
    {
        id: 'first_workout',
        name: 'Primeiros Passos',
        description: 'Complete seu primeiro treino',
        icon: '🚀',
        category: 'first_time',
        unlocked: false
    },
    {
        id: 'first_workout_plan',
        name: 'Organizado',
        description: 'Crie seu primeiro treino',
        icon: '📋',
        category: 'first_time',
        unlocked: false
    },
    {
        id: 'first_level_up',
        name: 'Subindo de Nível',
        description: 'Suba de nível em qualquer exercício',
        icon: '⭐',
        category: 'first_time',
        unlocked: false
    },

    // CONQUISTAS DE PROGRESSO
    {
        id: 'workout_milestones',
        name: 'Consistente',
        description: 'Complete 5 treinos',
        icon: '📈',
        category: 'progress',
        unlocked: false,
        progress: 0,
        maxProgress: 5
    },
    {
        id: 'workout_milestones_10',
        name: 'Dedicado',
        description: 'Complete 10 treinos',
        icon: '🔥',
        category: 'progress',
        unlocked: false,
        progress: 0,
        maxProgress: 10
    },
    {
        id: 'workout_milestones_25',
        name: 'Viciado',
        description: 'Complete 25 treinos',
        icon: '💎',
        category: 'progress',
        unlocked: false,
        progress: 0,
        maxProgress: 25
    },
    {
        id: 'workout_milestones_50',
        name: 'Lendário',
        description: 'Complete 50 treinos',
        icon: '👑',
        category: 'progress',
        unlocked: false,
        progress: 0,
        maxProgress: 50
    },
    {
        id: 'weekly_workouts',
        name: 'Velocista',
        description: 'Complete 3 treinos em uma semana',
        icon: '⚡',
        category: 'progress',
        unlocked: false,
        progress: 0,
        maxProgress: 3
    },
    {
        id: 'weight_increase',
        name: 'Forte',
        description: 'Aumente o peso máximo em um exercício',
        icon: '🏋️',
        category: 'progress',
        unlocked: false
    },
    {
        id: 'level_milestones',
        name: 'Evolução',
        description: 'Suba 5 níveis no total',
        icon: '🚀',
        category: 'progress',
        unlocked: false,
        progress: 0,
        maxProgress: 5
    },

    // CONQUISTAS DE SEQUÊNCIA
    {
        id: 'streak_7',
        name: 'Chama',
        description: 'Mantenha 7 dias de treino consecutivos',
        icon: '🔥',
        category: 'streak',
        unlocked: false,
        progress: 0,
        maxProgress: 7
    },
    {
        id: 'streak_14',
        name: 'Determinado',
        description: 'Mantenha 14 dias de treino consecutivos',
        icon: '💪',
        category: 'streak',
        unlocked: false,
        progress: 0,
        maxProgress: 14
    },
    {
        id: 'streak_30',
        name: 'Diamante',
        description: 'Mantenha 30 dias de treino consecutivos',
        icon: '💎',
        category: 'streak',
        unlocked: false,
        progress: 0,
        maxProgress: 30
    },
    {
        id: 'streak_100',
        name: 'Foguete',
        description: 'Mantenha 100 dias de treino consecutivos',
        icon: '🚀',
        category: 'streak',
        unlocked: false,
        progress: 0,
        maxProgress: 100
    },

    // CONQUISTAS ESPECIAIS
    {
        id: 'xp_milestones',
        name: 'Acumulador',
        description: 'Alcance 1.000 XP total',
        icon: '💎',
        category: 'milestone',
        unlocked: false,
        progress: 0,
        maxProgress: 1000
    },
    {
        id: 'xp_milestones_5k',
        name: 'Experiente',
        description: 'Alcance 5.000 XP total',
        icon: '🌟',
        category: 'milestone',
        unlocked: false,
        progress: 0,
        maxProgress: 5000
    },
    {
        id: 'xp_milestones_10k',
        name: 'Mestre',
        description: 'Alcance 10.000 XP total',
        icon: '👑',
        category: 'milestone',
        unlocked: false,
        progress: 0,
        maxProgress: 10000
    },
    {
        id: 'variety',
        name: 'Versátil',
        description: 'Treine 5 categorias diferentes de exercícios',
        icon: '🎯',
        category: 'special',
        unlocked: false,
        progress: 0,
        maxProgress: 5
    }
];

// Função para verificar e desbloquear conquistas
export function checkAchievements(
    currentAchievements: Achievement[],
    progress: AchievementProgress
): { newAchievements: Achievement[], updatedAchievements: Achievement[] } {
    const newAchievements: Achievement[] = [];
    const updatedAchievements: Achievement[] = [];

    ACHIEVEMENTS.forEach(achievement => {
        const currentAchievement = currentAchievements.find(a => a.id === achievement.id);
        
        if (currentAchievement?.unlocked) {
            // Atualizar progresso de conquistas já desbloqueadas
            if (achievement.maxProgress) {
                const newProgress = getAchievementProgress(achievement.id, progress);
                if (newProgress !== currentAchievement.progress) {
                    updatedAchievements.push({
                        ...currentAchievement,
                        progress: newProgress
                    });
                }
            }
            return;
        }

        // Verificar se a conquista deve ser desbloqueada
        if (shouldUnlockAchievement(achievement.id, progress)) {
            const unlockedAchievement: Achievement = {
                ...achievement,
                unlocked: true,
                unlockedAt: new Date(),
                progress: achievement.maxProgress ? getAchievementProgress(achievement.id, progress) : undefined
            };
            
            newAchievements.push(unlockedAchievement);
        } else if (achievement.maxProgress) {
            // Adicionar progresso para conquistas não desbloqueadas
            const progressValue = getAchievementProgress(achievement.id, progress);
            if (progressValue > 0) {
                updatedAchievements.push({
                    ...achievement,
                    progress: progressValue
                });
            }
        }
    });

    return { newAchievements, updatedAchievements };
}

// Função para determinar se uma conquista deve ser desbloqueada
function shouldUnlockAchievement(achievementId: string, progress: AchievementProgress): boolean {
    switch (achievementId) {
        case 'first_exercise':
            return progress.totalExercises >= 1;
        
        case 'first_workout':
            return progress.totalWorkouts >= 1;
        
        case 'first_workout_plan':
            return progress.totalExercises >= 1; // Assumindo que se tem exercício, pode criar treino
        
        case 'first_level_up':
            return progress.exerciseLevelUps >= 1;
        
        case 'workout_milestones':
            return progress.totalWorkouts >= 5;
        
        case 'workout_milestones_10':
            return progress.totalWorkouts >= 10;
        
        case 'workout_milestones_25':
            return progress.totalWorkouts >= 25;
        
        case 'workout_milestones_50':
            return progress.totalWorkouts >= 50;
        
        case 'weekly_workouts':
            return progress.workoutsThisWeek >= 3;
        
        case 'weight_increase':
            return progress.weightIncreases >= 1;
        
        case 'level_milestones':
            return progress.totalLevels >= 5;
        
        case 'streak_7':
            return progress.currentStreak >= 7;
        
        case 'streak_14':
            return progress.currentStreak >= 14;
        
        case 'streak_30':
            return progress.currentStreak >= 30;
        
        case 'streak_100':
            return progress.currentStreak >= 100;
        
        case 'xp_milestones':
            return progress.totalXP >= 1000;
        
        case 'xp_milestones_5k':
            return progress.totalXP >= 5000;
        
        case 'xp_milestones_10k':
            return progress.totalXP >= 10000;
        
        case 'variety':
            return progress.totalExercises >= 5; // Simplificado para demonstração
        
        default:
            return false;
    }
}

// Função para obter o progresso atual de uma conquista
function getAchievementProgress(achievementId: string, progress: AchievementProgress): number {
    switch (achievementId) {
        case 'workout_milestones':
        case 'workout_milestones_10':
        case 'workout_milestones_25':
        case 'workout_milestones_50':
            return Math.min(progress.totalWorkouts, 50);
        
        case 'weekly_workouts':
            return Math.min(progress.workoutsThisWeek, 3);
        
        case 'level_milestones':
            return Math.min(progress.totalLevels, 5);
        
        case 'streak_7':
        case 'streak_14':
        case 'streak_30':
        case 'streak_100':
            return Math.min(progress.currentStreak, 100);
        
        case 'xp_milestones':
            return Math.min(progress.totalXP, 1000);
        
        case 'xp_milestones_5k':
            return Math.min(progress.totalXP, 5000);
        
        case 'xp_milestones_10k':
            return Math.min(progress.totalXP, 10000);
        
        case 'variety':
            return Math.min(progress.totalExercises, 5);
        
        default:
            return 0;
    }
}

// Função para obter conquistas por categoria
export function getAchievementsByCategory(achievements: Achievement[]): Record<string, Achievement[]> {
    const categorized: Record<string, Achievement[]> = {
        'first_time': [],
        'progress': [],
        'streak': [],
        'milestone': [],
        'special': []
    };

    achievements.forEach(achievement => {
        if (categorized[achievement.category]) {
            categorized[achievement.category].push(achievement);
        }
    });

    return categorized;
}

// Função para obter estatísticas das conquistas
export function getAchievementStats(achievements: Achievement[]): {
    total: number;
    unlocked: number;
    locked: number;
    completionRate: number;
} {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.unlocked).length;
    const locked = total - unlocked;
    const completionRate = total > 0 ? (unlocked / total) * 100 : 0;

    return {
        total,
        unlocked,
        locked,
        completionRate: Math.round(completionRate)
    };
}
