import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UserStats, WorkoutSession } from '../types';
import { Achievement } from '../utils/achievements';
import { baseStyles } from '../styles/mainStyle';
import { getAchievementsByCategory, getAchievementStats } from '../utils/achievements';

interface StatsCardProps {
    stats: UserStats;
    recentSessions?: WorkoutSession[];
    achievements?: Achievement[];
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
    stats, 
    recentSessions = [], 
    achievements = [] 
}) => {
    const categorizedAchievements = getAchievementsByCategory(achievements);
    const achievementStats = getAchievementStats(achievements);
    
    return (
        <View style={[baseStyles.gradientCard, styles.container]}>
            <Text style={[baseStyles.subHeader, styles.title]}>
                Estatísticas
            </Text>
            
            <View style={styles.mainStats}>
                <View style={styles.statRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.totalLevel}</Text>
                        <Text style={styles.statLabel}>Nível Total</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.totalXP.toLocaleString()}</Text>
                        <Text style={styles.statLabel}>XP Total</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
                        <Text style={styles.statLabel}>Treinos</Text>
                    </View>
                </View>
                
                <View style={styles.statRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.currentStreak}</Text>
                        <Text style={styles.statLabel}>Sequência Atual</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.longestStreak}</Text>
                        <Text style={styles.statLabel}>Melhor Sequência</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{Math.floor(stats.totalTime / 60)}h</Text>
                        <Text style={styles.statLabel}>Tempo Total</Text>
                    </View>
                </View>
            </View>
            
            {/* Seção de Conquistas */}
            <View style={styles.achievementsSection}>
                <View style={styles.achievementsHeader}>
                    <Text style={[baseStyles.bodyText, styles.achievementsTitle]}>
                        Conquistas
                    </Text>
                    <View style={styles.achievementStats}>
                        <Text style={styles.achievementCount}>
                            {achievementStats.unlocked}/{achievementStats.total}
                        </Text>
                        <Text style={styles.achievementPercentage}>
                            {achievementStats.completionRate}%
                        </Text>
                    </View>
                </View>
                
                <ScrollView style={styles.achievementsList} showsVerticalScrollIndicator={false}>
                    {/* Conquistas de Primeira Vez */}
                    {categorizedAchievements.first_time.length > 0 && (
                        <View style={styles.categorySection}>
                            <Text style={styles.categoryTitle}>🎯 Primeira Vez</Text>
                            {categorizedAchievements.first_time.map((achievement) => (
                                <AchievementItem key={achievement.id} achievement={achievement} />
                            ))}
                        </View>
                    )}
                    
                    {/* Conquistas de Progresso */}
                    {categorizedAchievements.progress.length > 0 && (
                        <View style={styles.categorySection}>
                            <Text style={styles.categoryTitle}>📈 Progresso</Text>
                            {categorizedAchievements.progress.map((achievement) => (
                                <AchievementItem key={achievement.id} achievement={achievement} />
                            ))}
                        </View>
                    )}
                    
                    {/* Conquistas de Sequência */}
                    {categorizedAchievements.streak.length > 0 && (
                        <View style={styles.categorySection}>
                            <Text style={styles.categoryTitle}>🔥 Sequência</Text>
                            {categorizedAchievements.streak.map((achievement) => (
                                <AchievementItem key={achievement.id} achievement={achievement} />
                            ))}
                        </View>
                    )}
                    
                    {/* Conquistas de Milestone */}
                    {categorizedAchievements.milestone.length > 0 && (
                        <View style={styles.categorySection}>
                            <Text style={styles.categoryTitle}>💎 Milestones</Text>
                            {categorizedAchievements.milestone.map((achievement) => (
                                <AchievementItem key={achievement.id} achievement={achievement} />
                            ))}
                        </View>
                    )}
                    
                    {/* Conquistas Especiais */}
                    {categorizedAchievements.special.length > 0 && (
                        <View style={styles.categorySection}>
                            <Text style={styles.categoryTitle}>⭐ Especiais</Text>
                            {categorizedAchievements.special.map((achievement) => (
                                <AchievementItem key={achievement.id} achievement={achievement} />
                            ))}
                        </View>
                    )}
                    
                    {achievements.length === 0 && (
                        <Text style={[baseStyles.captionText, styles.noAchievements]}>
                            Complete treinos para desbloquear conquistas
                        </Text>
                    )}
                </ScrollView>
            </View>

            {recentSessions.length > 0 && (
                <View style={styles.sessionsSection}>
                    <Text style={[baseStyles.bodyText, styles.sessionsTitle]}>
                        Treinos Recentes
                    </Text>
                    
                    <View style={styles.sessionsList}>
                        {recentSessions.slice(0, 5).map((session) => (
                            <View key={session.id} style={styles.sessionItem}>
                                <View style={styles.sessionHeader}>
                                    <Text style={[baseStyles.bodyText, styles.sessionDate]}>
                                        {new Date(session.date).toLocaleDateString('pt-BR')}
                                    </Text>
                                    <Text style={[baseStyles.titleText, styles.sessionXP]}>
                                        +{session.totalXP} XP
                                    </Text>
                                </View>
                                {session.notes && (
                                    <Text style={[baseStyles.captionText, styles.sessionNotes]}>
                                        {session.notes}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            )}
            
            <View style={styles.favoriteSection}>
                <Text style={[baseStyles.captionText, styles.favoriteTitle]}>
                    Exercício Favorito
                </Text>
                <Text style={[baseStyles.titleText, styles.favoriteExercise]}>
                    {stats.favoriteExercise}
                </Text>
            </View>
        </View>
    );
};

// Componente para mostrar cada conquista
const AchievementItem: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const isUnlocked = achievement.unlocked;
    
    return (
        <View style={[
            styles.achievementItem,
            isUnlocked ? styles.achievementUnlocked : styles.achievementLocked
        ]}>
            <View style={styles.achievementHeader}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                    <Text style={[
                        styles.achievementName,
                        isUnlocked ? styles.achievementNameUnlocked : styles.achievementNameLocked
                    ]}>
                        {achievement.name}
                    </Text>
                    <Text style={[
                        styles.achievementDescription,
                        isUnlocked ? styles.achievementDescriptionUnlocked : styles.achievementDescriptionLocked
                    ]}>
                        {achievement.description}
                    </Text>
                </View>
                <View style={styles.achievementStatus}>
                    {isUnlocked ? (
                        <Text style={styles.unlockedBadge}>✓</Text>
                    ) : (
                        <Text style={styles.lockedBadge}>🔒</Text>
                    )}
                </View>
            </View>
            
            {/* Barra de progresso para conquistas com progresso */}
            {achievement.maxProgress && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill, 
                                { width: `${(achievement.progress || 0) / achievement.maxProgress * 100}%` }
                            ]} 
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {achievement.progress || 0}/{achievement.maxProgress}
                    </Text>
                </View>
            )}
            
            {/* Data de desbloqueio */}
            {isUnlocked && achievement.unlockedAt && (
                <Text style={styles.unlockDate}>
                    Desbloqueado em {achievement.unlockedAt.toLocaleDateString('pt-BR')}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        padding: 24,
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 20,
    },
    mainStats: {
        marginBottom: 28,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#3B82F6',
        marginBottom: 6,
    },
    statLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '500',
        lineHeight: 14,
    },
    achievementsSection: {
        marginBottom: 24,
    },
    achievementsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    achievementsTitle: {
        fontWeight: '600',
        fontSize: 16,
    },
    achievementStats: {
        alignItems: 'flex-end',
    },
    achievementCount: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10B981',
    },
    achievementPercentage: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    achievementsList: {
        maxHeight: 300,
    },
    categorySection: {
        marginBottom: 20,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B5CF6',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    achievementItem: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
    },
    achievementUnlocked: {
        backgroundColor: '#1A1A1A',
        borderColor: '#10B981',
    },
    achievementLocked: {
        backgroundColor: '#2A2A2A',
        borderColor: '#3A3A3A',
        opacity: 0.7,
    },
    achievementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    achievementIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    achievementInfo: {
        flex: 1,
    },
    achievementName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    achievementNameUnlocked: {
        color: '#FFFFFF',
    },
    achievementNameLocked: {
        color: '#9CA3AF',
    },
    achievementDescription: {
        fontSize: 12,
        lineHeight: 16,
    },
    achievementDescriptionUnlocked: {
        color: '#9CA3AF',
    },
    achievementDescriptionLocked: {
        color: '#6B7280',
    },
    achievementStatus: {
        marginLeft: 8,
    },
    unlockedBadge: {
        fontSize: 16,
        color: '#10B981',
        fontWeight: '700',
    },
    lockedBadge: {
        fontSize: 14,
        opacity: 0.5,
    },
    progressContainer: {
        marginTop: 8,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#2A2A2A',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 11,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    unlockDate: {
        fontSize: 10,
        color: '#10B981',
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    noAchievements: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#6B7280',
        paddingVertical: 20,
        fontSize: 13,
    },
    sessionsSection: {
        marginBottom: 24,
    },
    sessionsTitle: {
        marginBottom: 16,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
    },
    sessionsList: {
        maxHeight: 180,
    },
    sessionItem: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    sessionDate: {
        fontSize: 13,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    sessionXP: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3B82F6',
    },
    sessionNotes: {
        fontSize: 11,
        color: '#9CA3AF',
        fontStyle: 'italic',
        lineHeight: 14,
    },
    favoriteSection: {
        alignItems: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
    },
    favoriteTitle: {
        marginBottom: 8,
        fontSize: 11,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    favoriteExercise: {
        fontSize: 18,
        fontWeight: '700',
        color: '#8B5CF6',
    },
});
