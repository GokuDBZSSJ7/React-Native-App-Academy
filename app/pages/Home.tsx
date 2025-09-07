import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    Platform,
    StatusBar
} from 'react-native';
import { baseStyles } from '../styles/mainStyle';
import { useApp } from '../context/AppContext';
import { ExerciseCard } from '../components/ExerciseCard';
import { StatsCard } from '../components/StatsCard';
import { AddExerciseModal } from '../components/AddExerciseModal';
import { WorkoutSessionModal } from '../components/WorkoutSessionModal';
import { SettingsModal } from '../components/SettingsModal';
import { AchievementUnlockedModal } from '../components/AchievementUnlockedModal';
import { CreateWorkoutModal } from '../components/CreateWorkoutModal';
import { AchievementsModal } from '../components/AchievementsModal';
import { Workout, WorkoutSession } from '../types';
import { Achievement } from '../utils/achievements';

type TabType = 'exercises' | 'workouts' | 'stats';

export default function Home() {
    const { state, addExercise, addWorkout, isLoading, resetData } = useApp();
    const [activeTab, setActiveTab] = useState<TabType>('exercises');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCreateWorkoutModal, setShowCreateWorkoutModal] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showAchievementModal, setShowAchievementModal] = useState(false);
    const [showAchievementsModal, setShowAchievementsModal] = useState(false);
    const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

    // Verificar conquistas desbloqueadas
    useEffect(() => {
        const unlockedAchievements = state.achievements.filter(a => a.unlocked);
        if (unlockedAchievements.length > 0) {
            // Mostrar a conquista mais recente
            const mostRecent = unlockedAchievements.sort((a, b) => 
                (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0)
            )[0];
            
            // Verificar se é uma conquista nova (desbloqueada nos últimos 5 segundos)
            if (mostRecent.unlockedAt) {
                const timeSinceUnlock = Date.now() - mostRecent.unlockedAt.getTime();
                if (timeSinceUnlock < 5000) { // 5 segundos
                    setUnlockedAchievement(mostRecent);
                    setShowAchievementModal(true);
                }
            }
        }
    }, [state.achievements]);

    // Função para completar treino
    const handleWorkoutComplete = (sessionData: any) => {
        try {
            // Criar uma nova sessão de treino
            const newSession: WorkoutSession = {
                id: Date.now().toString(),
                workoutId: sessionData.workoutId,
                date: new Date(),
                exercises: sessionData.exercises.map((ex: any) => ({
                    exerciseId: ex.exerciseId,
                    sets: ex.sets.map((set: any, index: number) => ({
                        setNumber: index + 1,
                        reps: set.reps || 0,
                        weight: set.weight || 0,
                        xp: 0, // Será calculado pelo sistema
                        completed: true
                    })),
                    totalXP: 0 // Será calculado pelo sistema
                })),
                totalXP: sessionData.totalXP,
                duration: 0, // Pode ser implementado depois
                notes: sessionData.notes || ''
            };

            // Atualizar o estado com a nova sessão
            // O reducer irá salvar automaticamente
            // Por enquanto, vamos apenas mostrar uma mensagem de sucesso
            Alert.alert(
                'Treino Completado!',
                `Parabéns! Você ganhou ${sessionData.totalXP} XP!`,
                [{ text: 'OK', style: 'default' }]
            );

            console.log('Sessão de treino criada:', newSession);
            
            // Fechar o modal
            setShowWorkoutModal(false);
            setSelectedWorkout(null);
        } catch (error) {
            console.error('Erro ao completar treino:', error);
            Alert.alert('Erro', 'Não foi possível completar o treino. Tente novamente.');
        }
    };

    // Mostrar loading enquanto carrega os dados
    if (isLoading) {
        return (
            <View style={[baseStyles.primaryBg, baseStyles.container, styles.loadingContainer]}>
                <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={[baseStyles.bodyText, styles.loadingText]}>
                    Carregando seus dados...
                </Text>
            </View>
        );
    }

    const renderExercisesTab = () => (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <View style={styles.headerSection}>
                <Text style={[baseStyles.titleText, styles.pageTitle]}>
                    Exercícios
                </Text>
                <Text style={[baseStyles.bodyText, styles.subtitle]}>
                    Gerencie seus exercícios e acompanhe seu progresso
                </Text>
            </View>

            <TouchableOpacity
                style={[baseStyles.modernButton, styles.addButton]}
                onPress={() => setShowAddModal(true)}
            >
                <Text style={baseStyles.buttonText}>Adicionar Exercício</Text>
            </TouchableOpacity>

            <View style={styles.exercisesList}>
                {state.exercises.map((exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onPress={() => {
                            // TODO: Implementar detalhes do exercício
                            console.log('Exercise pressed:', exercise.name);
                        }}
                    />
                ))}

                {state.exercises.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={[baseStyles.bodyText, styles.emptyTitle]}>
                            Nenhum exercício cadastrado
                        </Text>
                        <Text style={[baseStyles.captionText, styles.emptySubtitle]}>
                            Adicione seu primeiro exercício para começar a treinar
                        </Text>
                    </View>
                )}
            </View>
            
            {/* Espaço extra no final para evitar corte */}
            <View style={styles.bottomSpacer} />
        </ScrollView>
    );

    const renderWorkoutsTab = () => (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <View style={styles.headerSection}>
                <Text style={[baseStyles.titleText, styles.pageTitle]}>
                    Treinos
                </Text>
                <Text style={[baseStyles.bodyText, styles.subtitle]}>
                    Organize seus treinos por dia da semana
                </Text>
            </View>

            <TouchableOpacity
                style={[baseStyles.modernButton, styles.addButton]}
                onPress={() => setShowCreateWorkoutModal(true)}
            >
                <Text style={baseStyles.buttonText}>Criar Novo Treino</Text>
            </TouchableOpacity>

            <View style={styles.workoutDays}>
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => {
                    const dayWorkouts = state.workouts.filter(w => w.dayOfWeek === index);
                    return (
                        <View key={day} style={styles.workoutDay}>
                            <Text style={[baseStyles.titleText, styles.dayLabel]}>{day}</Text>
                            {dayWorkouts.length > 0 ? (
                                dayWorkouts.map(workout => (
                                    <TouchableOpacity 
                                        key={workout.id} 
                                        style={styles.workoutItem}
                                        onPress={() => {
                                            setSelectedWorkout(workout);
                                            setShowWorkoutModal(true);
                                        }}
                                    >
                                        <Text style={[baseStyles.bodyText, styles.workoutName]}>
                                            {workout.name}
                                        </Text>
                                        <Text style={[baseStyles.captionText, styles.workoutExercises]}>
                                            {workout.exercises.length} exercícios
                                        </Text>
                                        <Text style={[baseStyles.captionText, styles.startWorkout]}>
                                            Iniciar Treino
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={[baseStyles.captionText, styles.noWorkout]}>
                                    Sem treino
                                </Text>
                            )}
                        </View>
                    );
                })}
            </View>
            
            {/* Espaço extra no final para evitar corte */}
            <View style={styles.bottomSpacer} />
        </ScrollView>
    );

    const renderStatsTab = () => (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <View style={styles.headerSection}>
                <Text style={[baseStyles.titleText, styles.pageTitle]}>
                    Estatísticas
                </Text>
                <Text style={[baseStyles.bodyText, styles.subtitle]}>
                    Acompanhe seu progresso e conquistas
                </Text>
            </View>

            {/* Botão para abrir modal de conquistas */}
            <TouchableOpacity
                style={[baseStyles.modernButton, styles.achievementsButton]}
                onPress={() => setShowAchievementsModal(true)}
            >
                <Text style={baseStyles.buttonText}>🏆 Ver Todas as Conquistas</Text>
            </TouchableOpacity>

            <StatsCard stats={state.stats} recentSessions={state.sessions} achievements={state.achievements} />

            <View style={styles.levelingInfo}>
                <Text style={[baseStyles.subHeader, styles.infoTitle]}>
                    Como Funciona o Sistema de Leveling
                </Text>
                <Text style={[baseStyles.bodyText, styles.infoText]}>
                    • Cada exercício tem seu próprio nível e XP{'\n'}
                    • Complete sets para ganhar XP{'\n'}
                    • Quanto mais peso e repetições, mais XP{'\n'}
                    • Mantenha uma sequência de treinos para bônus{'\n'}
                    • Suba de nível para desbloquear mais XP por treino
                </Text>
            </View>
            
            {/* Espaço extra no final para evitar corte */}
            <View style={styles.bottomSpacer} />
        </ScrollView>
    );

    return (
        <View style={[baseStyles.primaryBg, baseStyles.container]}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
            
            {/* Header com SafeAreaView personalizado */}
            <SafeAreaView style={styles.safeAreaHeader}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.titleContainer}>
                            <Text style={[baseStyles.displayText, styles.appTitle]}>
                                Level Up Gym
                            </Text>
                        </View>
                        
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={() => setShowSettingsModal(true)}
                        >
                            <Text style={styles.settingsIcon}>⚙️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'exercises' && styles.activeTab
                    ]}
                    onPress={() => setActiveTab('exercises')}
                >
                    <Text style={[
                        styles.tabText,
                        activeTab === 'exercises' && styles.activeTabText
                    ]}>
                        Exercícios
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'workouts' && styles.activeTab
                    ]}
                    onPress={() => setActiveTab('workouts')}
                >
                    <Text style={[
                        styles.tabText,
                        activeTab === 'workouts' && styles.activeTabText
                    ]}>
                        Treinos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'stats' && styles.activeTab
                    ]}
                    onPress={() => setActiveTab('stats')}
                >
                    <Text style={[
                        styles.tabText,
                        activeTab === 'stats' && styles.activeTabText
                    ]}>
                        Estatísticas
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === 'exercises' && renderExercisesTab()}
            {activeTab === 'workouts' && renderWorkoutsTab()}
            {activeTab === 'stats' && renderStatsTab()}

            {/* Add Exercise Modal */}
            <AddExerciseModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={addExercise}
            />

            {/* Create Workout Modal */}
            <CreateWorkoutModal
                visible={showCreateWorkoutModal}
                onClose={() => setShowCreateWorkoutModal(false)}
                onCreate={addWorkout}
                exercises={state.exercises}
            />

            {/* Workout Session Modal */}
            {selectedWorkout && (
                <WorkoutSessionModal
                    visible={showWorkoutModal}
                    onClose={() => {
                        setShowWorkoutModal(false);
                        setSelectedWorkout(null);
                    }}
                    workout={selectedWorkout}
                    exercises={state.exercises}
                    onComplete={handleWorkoutComplete}
                />
            )}

            {/* Settings Modal */}
            <SettingsModal
                visible={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                onResetData={resetData}
            />

            {/* Achievement Unlocked Modal */}
            <AchievementUnlockedModal
                visible={showAchievementModal}
                achievement={unlockedAchievement}
                onClose={() => {
                    setShowAchievementModal(false);
                    setUnlockedAchievement(null);
                }}
            />

            {/* Achievements Modal */}
            <AchievementsModal
                visible={showAchievementsModal}
                onClose={() => setShowAchievementsModal(false)}
                achievements={state.achievements}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    safeAreaHeader: {
        backgroundColor: '#0A0A0A',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 20,
        color: '#9CA3AF',
        opacity: 0.8,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 20 : 40, // Mais espaço no topo
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    appTitle: {
        marginBottom: 8,
        color: '#3B82F6',
        textAlign: 'center',
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2A2A2A',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    settingsIcon: {
        fontSize: 18,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 8, // Reduzido para dar mais espaço às abas
        paddingVertical: 8,
        marginHorizontal: 16, // Reduzido para dar mais espaço às abas
        marginTop: 16,
        borderRadius: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 14, // Aumentado para melhor toque
        paddingHorizontal: 20, // Aumentado para mais espaço interno
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 2, // Reduzido para dar mais espaço às abas
        minWidth: 100, // Largura mínima para evitar quebra de texto
    },
    activeTab: {
        backgroundColor: '#3B82F6',
    },
    tabText: {
        color: '#9CA3AF',
        fontSize: 10, // Reduzido ligeiramente para caber melhor
        fontWeight: '600',
        textAlign: 'center', // Garantir centralização
        lineHeight: 16, // Altura de linha otimizada
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    tabContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerSection: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 24,
    },
    pageTitle: {
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: '#9CA3AF',
        opacity: 0.8,
        lineHeight: 20,
    },
    addButton: {
        marginBottom: 20,
    },
    achievementsButton: {
        marginBottom: 20,
        backgroundColor: '#8B5CF6',
    },
    exercisesList: {
        marginBottom: 20,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        textAlign: 'center',
        color: '#9CA3AF',
        lineHeight: 20,
        opacity: 0.7,
    },
    workoutDays: {
        marginBottom: 24,
    },
    workoutDay: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    dayLabel: {
        marginBottom: 12,
        color: '#3B82F6',
        fontWeight: '700',
        fontSize: 16,
    },
    workoutItem: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    workoutName: {
        fontWeight: '600',
        marginBottom: 6,
        fontSize: 16,
    },
    workoutExercises: {
        color: '#9CA3AF',
        marginBottom: 8,
        fontSize: 14,
    },
    noWorkout: {
        color: '#6B7280',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 24,
        opacity: 0.7,
    },
    levelingInfo: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 24,
        marginTop: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    infoTitle: {
        textAlign: 'center',
        marginBottom: 16,
        color: '#8B5CF6',
        fontSize: 18,
    },
    infoText: {
        lineHeight: 24,
        color: '#9CA3AF',
        opacity: 0.8,
        fontSize: 14,
    },
    startWorkout: {
        color: '#10B981',
        textAlign: 'center',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontSize: 12,
    },
    bottomSpacer: {
        height: 40,
    },
});