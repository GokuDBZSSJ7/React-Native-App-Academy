import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, Workout, WorkoutSession, UserStats } from '../types';
import { checkLevelUp, calculateSetXP } from '../utils/xpSystem';
import { Achievement, AchievementProgress, ACHIEVEMENTS, checkAchievements } from '../utils/achievements';

// Estado inicial
interface AppState {
    exercises: Exercise[];
    workouts: Workout[];
    sessions: WorkoutSession[];
    stats: UserStats;
    currentStreak: number;
    achievements: Achievement[];
}

// Ações disponíveis
type AppAction =
    | { type: 'ADD_EXERCISE'; payload: Exercise }
    | { type: 'UPDATE_EXERCISE'; payload: Exercise }
    | { type: 'ADD_WORKOUT'; payload: Workout }
    | { type: 'UPDATE_WORKOUT'; payload: Workout }
    | { type: 'DELETE_WORKOUT'; payload: string }
    | { type: 'ADD_SESSION'; payload: WorkoutSession }
    | { type: 'UPDATE_STATS'; payload: Partial<UserStats> }
    | { type: 'COMPLETE_EXERCISE'; payload: { exerciseId: string; weight: number; reps: number; sets: number } }
    | { type: 'LOAD_STATE'; payload: AppState }
    | { type: 'RESET_STATE' }
    | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
    | { type: 'UPDATE_ACHIEVEMENTS'; payload: Achievement[] };

const initialState: AppState = {
    exercises: [],
    workouts: [],
    sessions: [],
    stats: {
        totalLevel: 0,
        totalXP: 0,
        totalWorkouts: 0,
        currentStreak: 0,
        longestStreak: 0,
        favoriteExercise: 'Nenhum',
        totalTime: 0,
        achievements: []
    },
    currentStreak: 0,
    achievements: ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        unlocked: false
    }))
};

// Chave para salvar no AsyncStorage
const STORAGE_KEY = 'soloLevelingGym_data';

// Funções de persistência
const saveStateToStorage = async (state: AppState) => {
    try {
        // Converter datas para string antes de salvar
        const stateToSave = {
            ...state,
            exercises: state.exercises.map(ex => ({
                ...ex,
                lastPerformed: ex.lastPerformed ? ex.lastPerformed.toISOString() : null
            })),
            workouts: state.workouts.map(w => ({
                ...w,
                createdAt: w.createdAt.toISOString()
            })),
            sessions: state.sessions.map(s => ({
                ...s,
                date: s.date.toISOString()
            })),
            achievements: state.achievements.map(a => ({
                ...a,
                unlockedAt: a.unlockedAt ? a.unlockedAt.toISOString() : null
            }))
        };
        
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        console.log('✅ Estado salvo com sucesso');
    } catch (error) {
        console.error('❌ Erro ao salvar estado:', error);
    }
};

const loadStateFromStorage = async (): Promise<AppState | null> => {
    try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            
            // Converter strings de volta para Date
            const stateWithDates = {
                ...parsedState,
                exercises: parsedState.exercises.map((ex: any) => ({
                    ...ex,
                    lastPerformed: ex.lastPerformed ? new Date(ex.lastPerformed) : null
                })),
                workouts: parsedState.workouts.map((w: any) => ({
                    ...w,
                    createdAt: new Date(w.createdAt)
                })),
                sessions: parsedState.sessions.map((s: any) => ({
                    ...s,
                    date: new Date(s.date)
                })),
                achievements: parsedState.achievements ? parsedState.achievements.map((a: any) => ({
                    ...a,
                    unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : null
                })) : ACHIEVEMENTS.map(achievement => ({
                    ...achievement,
                    unlocked: false
                }))
            };
            
            console.log('✅ Estado carregado com sucesso');
            return stateWithDates;
        }
        return null;
    } catch (error) {
        console.error('❌ Erro ao carregar estado:', error);
        return null;
    }
};

// Função para limpar completamente o AsyncStorage
const clearStorage = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log('✅ Storage limpo com sucesso');
    } catch (error) {
        console.error('❌ Erro ao limpar storage:', error);
    }
};

// Função para calcular progresso das conquistas
const calculateAchievementProgress = (state: AppState): AchievementProgress => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const workoutsThisWeek = state.sessions.filter(s => 
        s.date >= oneWeekAgo
    ).length;

    const exerciseLevelUps = state.exercises.reduce((total, ex) => 
        total + (ex.currentLevel - 1), 0
    );

    const weightIncreases = state.exercises.reduce((total, ex) => 
        total + (ex.maxWeight > 0 ? 1 : 0), 0
    );

    const consecutiveWorkoutDays = state.currentStreak;

    return {
        totalWorkouts: state.sessions.length,
        totalExercises: state.exercises.length,
        currentStreak: state.currentStreak,
        longestStreak: state.stats.longestStreak,
        totalLevels: state.exercises.reduce((total, ex) => total + ex.currentLevel, 0),
        totalXP: state.stats.totalXP,
        workoutsThisWeek,
        lastWorkoutDate: state.sessions.length > 0 ? state.sessions[state.sessions.length - 1].date : undefined,
        exerciseLevelUps,
        weightIncreases,
        consecutiveWorkoutDays,
        firstWorkoutDate: state.sessions.length > 0 ? state.sessions[0].date : undefined,
        firstExerciseDate: state.exercises.length > 0 ? new Date() : undefined
    };
};

// Função para verificar conquistas
const checkAndUpdateAchievements = (state: AppState): AppState => {
    const progress = calculateAchievementProgress(state);
    const { newAchievements, updatedAchievements } = checkAchievements(state.achievements, progress);
    
    if (newAchievements.length > 0 || updatedAchievements.length > 0) {
        let updatedAchievementsList = [...state.achievements];
        
        // Atualizar conquistas existentes
        updatedAchievements.forEach(updated => {
            const index = updatedAchievementsList.findIndex(a => a.id === updated.id);
            if (index !== -1) {
                updatedAchievementsList[index] = updated;
            }
        });
        
        // Adicionar novas conquistas
        newAchievements.forEach(newAchievement => {
            const index = updatedAchievementsList.findIndex(a => a.id === newAchievement.id);
            if (index !== -1) {
                updatedAchievementsList[index] = newAchievement;
            } else {
                updatedAchievementsList.push(newAchievement);
            }
        });
        
        return {
            ...state,
            achievements: updatedAchievementsList
        };
    }
    
    return state;
};

// Reducer para gerenciar o estado
function appReducer(state: AppState, action: AppAction): AppState {
    let newState: AppState;

    switch (action.type) {
        case 'LOAD_STATE':
            return action.payload;

        case 'RESET_STATE':
            return initialState;

        case 'ADD_EXERCISE':
            newState = {
                ...state,
                exercises: [...state.exercises, action.payload]
            };
            break;

        case 'UPDATE_EXERCISE':
            newState = {
                ...state,
                exercises: state.exercises.map(ex => 
                    ex.id === action.payload.id ? action.payload : ex
                )
            };
            break;

        case 'ADD_WORKOUT':
            newState = {
                ...state,
                workouts: [...state.workouts, action.payload]
            };
            break;

        case 'UPDATE_WORKOUT':
            newState = {
                ...state,
                workouts: state.workouts.map(w => 
                    w.id === action.payload.id ? action.payload : w
                )
            };
            break;

        case 'DELETE_WORKOUT':
            newState = {
                ...state,
                workouts: state.workouts.filter(w => w.id !== action.payload)
            };
            break;

        case 'ADD_SESSION':
            newState = {
                ...state,
                sessions: [...state.sessions, action.payload],
                stats: {
                    ...state.stats,
                    totalWorkouts: state.stats.totalWorkouts + 1,
                    totalTime: state.stats.totalTime + action.payload.duration
                }
            };
            break;

        case 'COMPLETE_EXERCISE':
            const exercise = state.exercises.find(ex => ex.id === action.payload.exerciseId);
            if (!exercise) return state;

            const xpGained = calculateSetXP(
                action.payload.weight,
                action.payload.reps,
                exercise.currentLevel,
                exercise.streak
            );

            const updatedExercise = {
                ...exercise,
                currentXP: exercise.currentXP + xpGained,
                totalXP: exercise.totalXP + xpGained,
                maxWeight: Math.max(exercise.maxWeight, action.payload.weight),
                maxReps: Math.max(exercise.maxReps, action.payload.reps),
                maxSets: Math.max(exercise.maxSets, action.payload.sets),
                lastPerformed: new Date(),
                streak: exercise.streak + 1
            };

            // Verificar se subiu de nível
            const levelUpResult = checkLevelUp(updatedExercise);
            if (levelUpResult.leveledUp) {
                updatedExercise.currentLevel = levelUpResult.newLevel;
                updatedExercise.currentXP = levelUpResult.xpRemaining;
                updatedExercise.xpToNextLevel = 100 * Math.pow(1.5, levelUpResult.newLevel - 1);
            }

            newState = {
                ...state,
                exercises: state.exercises.map(ex => 
                    ex.id === action.payload.exerciseId ? updatedExercise : ex
                ),
                stats: {
                    ...state.stats,
                    totalXP: state.stats.totalXP + xpGained,
                    totalLevel: state.exercises.reduce((total, ex) => total + ex.currentLevel, 0)
                }
            };
            break;

        case 'UPDATE_STATS':
            newState = {
                ...state,
                stats: { ...state.stats, ...action.payload }
            };
            break;

        case 'UNLOCK_ACHIEVEMENT':
            newState = {
                ...state,
                achievements: state.achievements.map(a => 
                    a.id === action.payload.id ? action.payload : a
                )
            };
            break;

        case 'UPDATE_ACHIEVEMENTS':
            newState = {
                ...state,
                achievements: action.payload
            };
            break;

        default:
            return state;
    }

    // Verificar conquistas após cada mudança
    newState = checkAndUpdateAchievements(newState);

    // Salvar automaticamente após cada mudança
    saveStateToStorage(newState);
    return newState;
}

// Contexto
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    addExercise: (exercise: Omit<Exercise, 'id'>) => void;
    addWorkout: (workout: Omit<Workout, 'id' | 'createdAt'>) => void;
    completeExercise: (exerciseId: string, weight: number, reps: number, sets: number) => void;
    getExercisesByCategory: (category: string) => Exercise[];
    getWorkoutsByDay: (dayOfWeek: number) => Workout[];
    resetData: () => Promise<void>;
    isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider do contexto
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const [isLoading, setIsLoading] = React.useState(true);

    // Carregar dados salvos ao inicializar
    useEffect(() => {
        const initializeApp = async () => {
            try {
                setIsLoading(true);
                const savedState = await loadStateFromStorage();
                
                if (savedState) {
                    dispatch({ type: 'LOAD_STATE', payload: savedState });
                }
            } catch (error) {
                console.error('Erro ao inicializar app:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeApp();
    }, []);

    const addExercise = (exercise: Omit<Exercise, 'id'>) => {
        const newExercise: Exercise = {
            ...exercise,
            id: Date.now().toString(),
            xpToNextLevel: 100
        };
        dispatch({ type: 'ADD_EXERCISE', payload: newExercise });
    };

    const addWorkout = (workout: Omit<Workout, 'id' | 'createdAt'>) => {
        const newWorkout: Workout = {
            ...workout,
            id: Date.now().toString(),
            createdAt: new Date()
        };
        dispatch({ type: 'ADD_WORKOUT', payload: newWorkout });
    };

    const completeExercise = (exerciseId: string, weight: number, reps: number, sets: number) => {
        dispatch({ 
            type: 'COMPLETE_EXERCISE', 
            payload: { exerciseId, weight, reps, sets } 
        });
    };

    const getExercisesByCategory = (category: string) => {
        return state.exercises.filter(ex => ex.category === category);
    };

    const getWorkoutsByDay = (dayOfWeek: number) => {
        return state.workouts.filter(w => w.dayOfWeek === dayOfWeek);
    };

    const resetData = async () => {
        await clearStorage();
        dispatch({ type: 'RESET_STATE' });
    };

    const value: AppContextType = {
        state,
        dispatch,
        addExercise,
        addWorkout,
        completeExercise,
        getExercisesByCategory,
        getWorkoutsByDay,
        resetData,
        isLoading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Hook para usar o contexto
export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
