import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Exercise } from '../types';
import { baseStyles } from '../styles/mainStyle';

interface ExerciseCardProps {
    exercise: Exercise;
    onPress: () => void;
    showProgress?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
    exercise, 
    onPress, 
    showProgress = true 
}) => {
    const progressPercentage = exercise.xpToNextLevel > 0 
        ? Math.round((exercise.currentXP / exercise.xpToNextLevel) * 100)
        : 0;

    return (
        <TouchableOpacity 
            style={[baseStyles.card, styles.container]} 
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Header com nome e nível */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={[baseStyles.titleText, styles.exerciseName]}>
                        {exercise.name}
                    </Text>
                    <View style={[baseStyles.levelBadge, styles.levelBadge]}>
                        <Text style={[baseStyles.buttonText, styles.levelText]}>
                            Nv. {exercise.currentLevel}
                        </Text>
                    </View>
                </View>
                <Text style={[baseStyles.captionText, styles.category]}>
                    {exercise.category}
                </Text>
            </View>

            {/* Barra de progresso XP */}
            {showProgress && (
                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={[baseStyles.bodyText, styles.xpInfo]}>
                            {exercise.currentXP} / {exercise.xpToNextLevel} XP
                        </Text>
                        <Text style={[baseStyles.captionText, styles.progressText]}>
                            {progressPercentage}%
                        </Text>
                    </View>
                    
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill, 
                                { width: `${progressPercentage}%` }
                            ]} 
                        />
                    </View>
                </View>
            )}

            {/* Estatísticas do exercício */}
            <View style={[baseStyles.row, styles.statsContainer]}>
                <View style={styles.stat}>
                    <Text style={[baseStyles.captionText, styles.statLabel]}>
                        Peso Máx
                    </Text>
                    <Text style={[baseStyles.titleText, styles.statValue]}>
                        {exercise.maxWeight}kg
                    </Text>
                </View>
                
                <View style={styles.stat}>
                    <Text style={[baseStyles.captionText, styles.statLabel]}>
                        Reps Máx
                    </Text>
                    <Text style={[baseStyles.titleText, styles.statValue]}>
                        {exercise.maxReps}
                    </Text>
                </View>
                
                <View style={styles.stat}>
                    <Text style={[baseStyles.captionText, styles.statLabel]}>
                        Sequência
                    </Text>
                    <Text style={[baseStyles.titleText, styles.streakValue]}>
                        {exercise.streak}
                    </Text>
                </View>
            </View>

            {/* Data do último treino */}
            {exercise.lastPerformed && (
                <Text style={[baseStyles.captionText, styles.lastPerformed]}>
                    Último treino: {exercise.lastPerformed.toLocaleDateString('pt-BR')}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        padding: 20,
    },
    header: {
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    exerciseName: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        marginRight: 12,
    },
    levelBadge: {
        minWidth: 60,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    levelText: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
    },
    category: {
        fontSize: 13,
        color: '#9CA3AF',
        opacity: 0.8,
    },
    progressSection: {
        marginBottom: 20,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    xpInfo: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    progressText: {
        fontSize: 12,
        color: '#3B82F6',
        fontWeight: '600',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#2A2A2A',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 3,
    },
    statsContainer: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3B82F6',
    },
    streakValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#10B981',
    },
    lastPerformed: {
        fontSize: 11,
        color: '#6B7280',
        textAlign: 'center',
        fontStyle: 'italic',
        opacity: 0.7,
    },
});
